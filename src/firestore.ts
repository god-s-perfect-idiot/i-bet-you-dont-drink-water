import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { DocumentReference } from "firebase/firestore";
import { db } from "./firebase";
import {
  debugBetSummary,
  debugChoreSummary,
  debugLog,
} from "./debugLog";
import { getStoreItemPrice } from "./storeItems";
import type {
  Bet,
  BetSide,
  Chore,
  LeaderboardEntry,
  Reward,
  UserProfile,
  UserReward,
} from "./types";

const STARTING_BALANCE = 10_000;
const CHORE_COMPLETION_REWARD = 50;
type BetSettlementDoc = {
  bettorUserId: string;
  side: BetSide;
  stake: number;
  ref: DocumentReference;
};

const toIso = (value: Timestamp | null | undefined): string | null =>
  value ? value.toDate().toISOString() : null;

function isPermissionDeniedError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "permission-denied"
  );
}

const choreFromSnap = (id: string, data: Record<string, unknown>): Chore => ({
  id,
  ownerUserId: String(data.ownerUserId),
  title: String(data.title),
  expiresAt: (data.expiresAt as Timestamp).toDate().toISOString(),
  completedAt: toIso(data.completedAt as Timestamp | null),
  status: (data.status as Chore["status"]) ?? "open",
  settledAt: toIso(data.settledAt as Timestamp | null),
  totalOnComplete: Number(data.totalOnComplete ?? 0),
  totalOnFail: Number(data.totalOnFail ?? 0),
  totalPool: Number(data.totalPool ?? 0),
});

const betFromSnap = (id: string, data: Record<string, unknown>): Bet => ({
  id,
  bettorUserId: String(data.bettorUserId),
  choreId: String(data.choreId),
  side: data.side as BetSide,
  stake: Number(data.stake),
  status: data.status as Bet["status"],
  settledAt: toIso(data.settledAt as Timestamp | null),
  createdAt: ((data.createdAt as Timestamp) ?? Timestamp.now())
    .toDate()
    .toISOString(),
  payout: Number(data.payout ?? 0),
});

export async function ensureUserProfile(
  uid: string,
  handle: string,
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const existing = await getDoc(userRef);
  if (existing.exists()) {
    return;
  }
  await setDoc(userRef, {
    handle,
    startingBalance: STARTING_BALANCE,
    balance: STARTING_BALANCE,
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "walletLedger"), {
    userId: uid,
    delta: STARTING_BALANCE,
    reason: "seed",
    createdAt: serverTimestamp(),
  });
}

export async function updateUserHandle(
  uid: string,
  handle: string,
): Promise<void> {
  const nextHandle = handle.trim();
  if (!nextHandle) {
    throw new Error("User name cannot be empty");
  }
  await updateDoc(doc(db, "users", uid), {
    handle: nextHandle,
  });
}

export function subscribeProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
): () => void {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (!snap.exists()) {
      onData(null);
      return;
    }
    const data = snap.data();
    onData({
      id: uid,
      handle: String(data.handle ?? "anonymous"),
      startingBalance: Number(data.startingBalance ?? STARTING_BALANCE),
      balance: Number(data.balance ?? STARTING_BALANCE),
      createdAt: toIso(data.createdAt as Timestamp) ?? new Date().toISOString(),
    });
  });
}

export function subscribeTodos(
  uid: string,
  onData: (chores: Chore[]) => void,
): () => void {
  const q = query(
    collection(db, "chores"),
    where("ownerUserId", "==", uid),
    orderBy("expiresAt", "asc"),
  );
  return onSnapshot(q, (snap) => {
    const chores = snap.docs.map((entry) =>
      choreFromSnap(entry.id, entry.data() as Record<string, unknown>),
    );
    debugLog("chore", "subscribeTodos snapshot", {
      uid,
      count: chores.length,
      chores: debugChoreSummary(chores),
    });
    onData(chores);
  });
}

export async function createTodo(
  uid: string,
  title: string,
  expiresAtIso: string,
): Promise<void> {
  const ref = await addDoc(collection(db, "chores"), {
    ownerUserId: uid,
    title: title.trim(),
    expiresAt: Timestamp.fromDate(new Date(expiresAtIso)),
    completedAt: null,
    status: "open",
    settledAt: null,
    totalOnComplete: 0,
    totalOnFail: 0,
    totalPool: 0,
    createdAt: serverTimestamp(),
  });
  debugLog("chore", "createTodo", {
    choreId: ref.id,
    uid,
    title: title.trim(),
    expiresAt: expiresAtIso,
  });
}

export async function completeTodo(
  uid: string,
  choreId: string,
): Promise<void> {
  debugLog("chore", "completeTodo start", { uid, choreId });
  const choreRef = doc(db, "chores", choreId);
  const userRef = doc(db, "users", uid);
  try {
    await runTransaction(db, async (tx) => {
      const [choreSnap, userSnap] = await Promise.all([
        tx.get(choreRef),
        tx.get(userRef),
      ]);
      if (!choreSnap.exists()) {
        throw new Error("Chore not found");
      }
      if (!userSnap.exists()) {
        throw new Error("User not found");
      }
      const choreData = choreSnap.data();
      if (String(choreData.ownerUserId) !== uid) {
        throw new Error("You can only complete your own chores");
      }
      if (choreData.status !== "open") {
        throw new Error("This chore is already completed");
      }
      const expiresAt = (choreData.expiresAt as Timestamp).toDate();
      if (expiresAt <= new Date()) {
        throw new Error("This chore already expired");
      }

      tx.update(choreRef, {
        status: "completed",
        completedAt: serverTimestamp(),
      });
      tx.update(userRef, { balance: increment(CHORE_COMPLETION_REWARD) });
      tx.set(doc(collection(db, "walletLedger")), {
        userId: uid,
        delta: CHORE_COMPLETION_REWARD,
        reason: "chore_complete_reward",
        choreId,
        createdAt: serverTimestamp(),
      });
    });
    debugLog("chore", "completeTodo transaction ok", { uid, choreId });
    await settleChoreById(choreId);
    debugLog("chore", "completeTodo done (settlement attempted)", {
      uid,
      choreId,
    });
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      debugLog("settle", "settlement blocked by rules after completeTodo", {
        uid,
        choreId,
      });
      return;
    }
    debugLog("chore", "completeTodo failed", {
      uid,
      choreId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export function subscribePopularChores(
  onData: (chores: Chore[]) => void,
): () => void {
  const q = query(
    collection(db, "chores"),
    orderBy("totalPool", "desc"),
    limit(10),
  );
  return onSnapshot(q, (snap) => {
    const chores = snap.docs.map((entry) =>
      choreFromSnap(entry.id, entry.data() as Record<string, unknown>),
    );
    debugLog("chore", "subscribePopularChores snapshot", {
      count: chores.length,
      openCount: chores.filter((chore) => chore.status === "open").length,
      settledCount: chores.filter((chore) => Boolean(chore.settledAt)).length,
      chores: debugChoreSummary(chores),
    });
    onData(chores);
  });
}

export function subscribeMyBets(
  uid: string,
  onData: (bets: Bet[]) => void,
): () => void {
  const q = query(
    collection(db, "bets"),
    where("bettorUserId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(30),
  );
  return onSnapshot(q, (snap) => {
    const bets = snap.docs.map((entry) =>
      betFromSnap(entry.id, entry.data() as Record<string, unknown>),
    );
    void (async () => {
      const uniqueChoreIds = Array.from(new Set(bets.map((bet) => bet.choreId)));
      const choreTitleEntries = await Promise.all(
        uniqueChoreIds.map(async (choreId) => {
          const choreSnap = await getDoc(doc(db, "chores", choreId));
          const title = choreSnap.exists() ? String(choreSnap.data().title ?? "") : "";
          return [choreId, title] as const;
        }),
      );
      const choreTitleById = new Map(choreTitleEntries);
      const enrichedBets = bets.map((bet) => ({
        ...bet,
        choreTitle: choreTitleById.get(bet.choreId) || undefined,
      }));
      debugLog("bet", "subscribeMyBets snapshot", {
        uid,
        count: enrichedBets.length,
        openCount: enrichedBets.filter((b) => b.status === "open").length,
        bets: debugBetSummary(enrichedBets),
      });
      onData(enrichedBets);
    })().catch((error) => {
      debugLog("bet", "subscribeMyBets enrich failed", {
        uid,
        error: error instanceof Error ? error.message : String(error),
      });
      onData(bets);
    });
  });
}

export async function getRandomCandidate(uid: string): Promise<Chore | null> {
  const now = new Date();
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const existingBetsQ = query(
    collection(db, "bets"),
    where("bettorUserId", "==", uid),
  );
  const existingBetsSnap = await getDocs(existingBetsQ);
  const excludedChoreIds = new Set(
    existingBetsSnap.docs.map((entry) => String(entry.data().choreId)),
  );
  const q = query(
    collection(db, "chores"),
    where("status", "==", "open"),
    where("expiresAt", ">", Timestamp.fromDate(now)),
    where("expiresAt", "<=", Timestamp.fromDate(nextDay)),
    limit(25),
  );
  const snap = await getDocs(q);
  const filtered = snap.docs
    .map((entry) =>
      choreFromSnap(entry.id, entry.data() as Record<string, unknown>),
    )
    .filter(
      (item) => item.ownerUserId !== uid && !excludedChoreIds.has(item.id),
    );
  debugLog("bet", "getRandomCandidate evaluated", {
    uid,
    fetched: snap.docs.length,
    excludedByExistingBet: excludedChoreIds.size,
    eligibleCount: filtered.length,
    eligible: debugChoreSummary(filtered),
  });
  if (filtered.length === 0) {
    debugLog("bet", "getRandomCandidate none", { uid });
    return null;
  }
  const index = Math.floor(Math.random() * filtered.length);
  debugLog("bet", "getRandomCandidate selected", {
    uid,
    index,
    chore: debugChoreSummary([filtered[index]])[0],
  });
  return filtered[index];
}

export async function purchaseStoreItem(
  uid: string,
  productId: string,
): Promise<void> {
  const price = getStoreItemPrice(productId);
  if (price === undefined) {
    throw new Error("Unknown item");
  }
  const userRef = doc(db, "users", uid);
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    const balance = Number(userSnap.data().balance ?? 0);
    if (balance < price) {
      throw new Error("Not enough balance");
    }
    tx.update(userRef, { balance: increment(-price) });
    tx.set(doc(collection(db, "walletLedger")), {
      userId: uid,
      delta: -price,
      reason: "store_purchase",
      productId,
      createdAt: serverTimestamp(),
    });
  });
}

export async function placeBet(
  uid: string,
  chore: Chore,
  side: BetSide,
  stake: number,
): Promise<void> {
  const existingBetQ = query(
    collection(db, "bets"),
    where("bettorUserId", "==", uid),
    where("choreId", "==", chore.id),
    limit(1),
  );
  const existingBetSnap = await getDocs(existingBetQ);
  if (!existingBetSnap.empty) {
    throw new Error("You already placed a bet on this chore");
  }

  const userRef = doc(db, "users", uid);
  const choreRef = doc(db, "chores", chore.id);
  const betRef = doc(db, "bets", `${uid}_${chore.id}`);

  await runTransaction(db, async (tx) => {
    const [userSnap, choreSnap] = await Promise.all([
      tx.get(userRef),
      tx.get(choreRef),
    ]);
    if (!userSnap.exists() || !choreSnap.exists()) {
      throw new Error("User or chore not found");
    }
    const user = userSnap.data();
    const target = choreSnap.data();
    const expiresAt = (target.expiresAt as Timestamp).toDate();
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (
      target.ownerUserId === uid ||
      target.status !== "open" ||
      expiresAt <= now ||
      expiresAt > tomorrow ||
      Number(user.balance ?? 0) < stake
    ) {
      throw new Error("This bet is not eligible");
    }
    const existingBet = await tx.get(betRef);
    if (existingBet.exists()) {
      throw new Error("You already placed a bet on this chore");
    }

    tx.update(userRef, { balance: increment(-stake) });
    tx.update(choreRef, {
      totalPool: increment(stake),
      totalOnComplete: side === "complete" ? increment(stake) : increment(0),
      totalOnFail: side === "fail" ? increment(stake) : increment(0),
    });

    tx.set(betRef, {
      bettorUserId: uid,
      choreId: chore.id,
      side,
      stake,
      status: "open",
      payout: 0,
      settledAt: null,
      createdAt: serverTimestamp(),
    });
    tx.set(doc(collection(db, "walletLedger")), {
      userId: uid,
      delta: -stake,
      reason: "bet_stake",
      choreId: chore.id,
      createdAt: serverTimestamp(),
    });
  });
  debugLog("bet", "placeBet ok", {
    uid,
    betId: `${uid}_${chore.id}`,
    choreId: chore.id,
    side,
    stake,
  });
}

export async function settleExpiredChores(): Promise<void> {
  const now = Timestamp.fromDate(new Date());
  debugLog("settle", "settleExpiredChores start", {
    now: now.toDate().toISOString(),
  });
  const expiredOpenQ = query(
    collection(db, "chores"),
    where("settledAt", "==", null),
    where("status", "==", "open"),
    where("expiresAt", "<=", now),
    limit(20),
  );
  const completedUnsettledQ = query(
    collection(db, "chores"),
    where("settledAt", "==", null),
    where("status", "==", "completed"),
    limit(20),
  );
  const [expiredOpenChores, completedUnsettledChores] = await Promise.all([
    getDocs(expiredOpenQ),
    getDocs(completedUnsettledQ),
  ]);
  const choreIds = new Set<string>();
  for (const choreDoc of expiredOpenChores.docs) {
    choreIds.add(choreDoc.id);
  }
  for (const choreDoc of completedUnsettledChores.docs) {
    choreIds.add(choreDoc.id);
  }

  if (choreIds.size > 0) {
    debugLog("settle", "settleExpiredChores", {
      choreIds: [...choreIds],
      expiredOpen: expiredOpenChores.docs.length,
      completedUnsettled: completedUnsettledChores.docs.length,
    });
  }

  for (const choreId of choreIds) {
    await settleChoreById(choreId, now);
  }
  debugLog("settle", "settleExpiredChores done", {
    attemptedCount: choreIds.size,
  });
}

export async function settleOpenBetsForUser(uid: string): Promise<void> {
  const openBetsQ = query(
    collection(db, "bets"),
    where("bettorUserId", "==", uid),
    where("status", "==", "open"),
    limit(100),
  );
  const openBetsSnap = await getDocs(openBetsQ);
  if (openBetsSnap.empty) {
    debugLog("settle", "settleOpenBetsForUser no open bets", { uid });
    return;
  }

  const now = Timestamp.fromDate(new Date());
  const choreIds = new Set<string>();
  for (const betDoc of openBetsSnap.docs) {
    const data = betDoc.data();
    choreIds.add(String(data.choreId));
  }
  debugLog("settle", "settleOpenBetsForUser", {
    uid,
    openBetCount: openBetsSnap.docs.length,
    choreIds: [...choreIds],
    openBets: openBetsSnap.docs.map((d) => ({
      betId: d.id,
      choreId: d.data().choreId,
      side: d.data().side,
      stake: d.data().stake,
    })),
  });
  for (const choreId of choreIds) {
    await settleChoreById(choreId, now);
  }
  debugLog("settle", "settleOpenBetsForUser done", {
    uid,
    attemptedCount: choreIds.size,
  });
}

async function settleChoreById(
  choreId: string,
  now: Timestamp = Timestamp.fromDate(new Date()),
): Promise<void> {
  const choreRef = doc(db, "chores", choreId);
  const openBetsQ = query(
    collection(db, "bets"),
    where("choreId", "==", choreId),
    where("status", "==", "open"),
  );
  const openBetsSnap = await getDocs(openBetsQ);
  const openBetRefs = openBetsSnap.docs.map((entry) => entry.ref);
  debugLog("settle", "settleChoreById start", {
    choreId,
    openBetCount: openBetRefs.length,
    openBetIds: openBetsSnap.docs.map((d) => d.id),
    now: now.toDate().toISOString(),
  });

  let skipReason: string | null = null;
  let settlementResult: Record<string, unknown> | null = null;

  await runTransaction(db, async (tx) => {
    const freshChore = await tx.get(choreRef);
    if (!freshChore.exists()) {
      skipReason = "chore_not_found";
      return;
    }
    const choreData = freshChore.data();
    if (choreData.settledAt) {
      skipReason = "already_settled";
      return;
    }
    debugLog("settle", "settleChoreById chore snapshot", {
      choreId,
      ownerUserId: String(choreData.ownerUserId),
      status: String(choreData.status),
      settledAt: toIso(choreData.settledAt as Timestamp | null),
      expiresAt: (choreData.expiresAt as Timestamp).toDate().toISOString(),
      completedAt: toIso(choreData.completedAt as Timestamp | null),
      totalPool: Number(choreData.totalPool ?? 0),
      totalOnComplete: Number(choreData.totalOnComplete ?? 0),
      totalOnFail: Number(choreData.totalOnFail ?? 0),
      now: now.toDate().toISOString(),
    });
    const isExpiredOpenChore =
      choreData.status === "open" &&
      (choreData.expiresAt as Timestamp).toMillis() <= now.toMillis();
    if (choreData.status === "open" && !isExpiredOpenChore) {
      skipReason = "still_open_not_expired";
      debugLog("settle", "settleChoreById skipped open chore before expiry", {
        choreId,
        status: String(choreData.status),
        expiresAt: (choreData.expiresAt as Timestamp).toDate().toISOString(),
        now: now.toDate().toISOString(),
      });
      return;
    }
    const effectiveStatus = isExpiredOpenChore ? "completed" : choreData.status;
    const effectiveCompletedAt = isExpiredOpenChore
      ? now
      : (choreData.completedAt as Timestamp | null);
    const expiresAtMs = (choreData.expiresAt as Timestamp).toMillis();

    // A chore marked completed before expiry should settle as a "complete" win.
    // `completedAt` can be briefly absent right after a serverTimestamp write.
    const winsOnComplete =
      effectiveStatus === "completed" &&
      !isExpiredOpenChore &&
      (!effectiveCompletedAt ||
        (effectiveCompletedAt as Timestamp).toMillis() <= expiresAtMs);
    const winningSide: BetSide = winsOnComplete ? "complete" : "fail";
    debugLog("settle", "settleChoreById computed decision", {
      choreId,
      isExpiredOpenChore,
      effectiveStatus,
      effectiveCompletedAt: effectiveCompletedAt
        ? (effectiveCompletedAt as Timestamp).toDate().toISOString()
        : null,
      winsOnComplete,
      winningSide,
      expiresAtMs,
      nowMs: now.toMillis(),
    });

    const bets: BetSettlementDoc[] = [];
    for (const betRef of openBetRefs) {
      const betSnap = await tx.get(betRef);
      if (!betSnap.exists()) continue;
      const data = betSnap.data();
      if (String(data.status) !== "open") continue;
      bets.push({
        ref: betRef,
        bettorUserId: String(data.bettorUserId),
        side: data.side as BetSide,
        stake: Number(data.stake),
      });
    }
    const totalWinningStake = bets
      .filter((bet) => bet.side === winningSide)
      .reduce((sum, bet) => sum + Number(bet.stake), 0);
    const totalLosingStake = bets
      .filter((bet) => bet.side !== winningSide)
      .reduce((sum, bet) => sum + Number(bet.stake), 0);
    const totalStake = bets.reduce((sum, bet) => sum + Number(bet.stake), 0);
    const totalPool =
      Number(choreData.totalPool ?? 0) > 0
        ? Number(choreData.totalPool)
        : totalStake;
    const completedOwnerBonus =
      winsOnComplete && bets.length > 0 ? Math.floor(totalPool * 0.1) : 0;
    // Keep bettor behavior symmetric: whichever side wins gets the same 110% pool budget,
    // then winners split proportionally by their stake on the winning side.
    const bettorsPayoutBudget = bets.length > 0 ? Math.floor(totalPool * 1.1) : 0;
    debugLog("settle", "settleChoreById stake summary", {
      choreId,
      winningSide,
      totalWinningStake,
      totalLosingStake,
      totalStake,
      totalPool,
      openBetsCount: bets.length,
      bettorsPayoutBudget,
      completedOwnerBonus,
      betSides: bets.map((bet) => ({
        betId: bet.ref.id,
        side: bet.side,
        stake: bet.stake,
      })),
    });
    const winnerPayouts = new Map<string, number>();

    if (
      bets.length > 0 &&
      totalWinningStake > 0 &&
      bettorsPayoutBudget > 0
    ) {
      const winningBets = bets.filter((bet) => bet.side === winningSide);
      let assigned = 0;
      const payoutByWeight = winningBets.map((bet) => {
        const weightedPayout = Math.floor(
          (Number(bet.stake) / totalWinningStake) * bettorsPayoutBudget,
        );
        assigned += weightedPayout;
        return {
          betId: bet.ref.id,
          weightedPayout,
          stake: Number(bet.stake),
        };
      });
      let remainder = bettorsPayoutBudget - assigned;
      payoutByWeight.sort((a, b) => b.stake - a.stake);
      for (let i = 0; i < payoutByWeight.length && remainder > 0; i += 1) {
        payoutByWeight[i].weightedPayout += 1;
        remainder -= 1;
      }
      for (const payoutEntry of payoutByWeight) {
        winnerPayouts.set(payoutEntry.betId, payoutEntry.weightedPayout);
      }
    }

    for (const bet of bets) {
      const won = bet.side === winningSide;
      const payout = won ? winnerPayouts.get(bet.ref.id) ?? 0 : 0;
      tx.update(bet.ref, {
        status: won ? "won" : "lost",
        payout,
        settledAt: serverTimestamp(),
      });
      if (won && payout > 0) {
        const winnerRef = doc(db, "users", String(bet.bettorUserId));
        tx.update(winnerRef, { balance: increment(payout) });
        tx.set(doc(collection(db, "walletLedger")), {
          userId: bet.bettorUserId,
          delta: payout,
          reason: winsOnComplete ? "bet_completion_pool_payout" : "bet_payout",
          choreId,
          createdAt: serverTimestamp(),
        });
      }
    }

    if (completedOwnerBonus > 0) {
      tx.update(doc(db, "users", String(choreData.ownerUserId)), {
        balance: increment(completedOwnerBonus),
      });
      tx.set(doc(collection(db, "walletLedger")), {
        userId: String(choreData.ownerUserId),
        delta: completedOwnerBonus,
        reason: "chore_completion_pool_bonus",
        choreId,
        createdAt: serverTimestamp(),
      });
    }

    tx.update(choreRef, {
      ...(isExpiredOpenChore
        ? {
            status: "completed",
            completedAt: serverTimestamp(),
          }
        : {}),
      settledAt: serverTimestamp(),
    });

    settlementResult = {
      choreId,
      choreStatus: choreData.status,
      isExpiredOpenChore,
      effectiveStatus,
      expiresAt: (choreData.expiresAt as Timestamp).toDate().toISOString(),
      effectiveCompletedAt: effectiveCompletedAt
        ? (effectiveCompletedAt as Timestamp).toDate().toISOString()
        : null,
      winsOnComplete,
      winningSide,
      totalPool,
      totalStake,
      openBetsSettled: bets.length,
      betOutcomes: bets.map((bet) => ({
        betId: bet.ref.id,
        bettorUserId: bet.bettorUserId,
        side: bet.side,
        stake: bet.stake,
        won: bet.side === winningSide,
        payout: bet.side === winningSide ? winnerPayouts.get(bet.ref.id) ?? 0 : 0,
        finalStatus: winsOnComplete
          ? "won"
          : bet.side === winningSide
            ? "won"
            : "lost",
      })),
      completedOwnerBonus,
    };
  });

  if (skipReason) {
    debugLog("settle", "settleChoreById skipped", { choreId, skipReason });
  } else if (settlementResult) {
    debugLog("settle", "settleChoreById settled", settlementResult);
  } else {
    debugLog("settle", "settleChoreById no-op", {
      choreId,
      openBetCount: openBetRefs.length,
    });
  }
}

const rewardFromSnap = (id: string, data: Record<string, unknown>): Reward => ({
  id,
  creatorUserId: String(data.creatorUserId),
  title: String(data.title),
  cost: Number(data.cost ?? 0),
  subscriberCount: Number(data.subscriberCount ?? 0),
  createdAt: toIso(data.createdAt as Timestamp) ?? new Date().toISOString(),
});

const userRewardFromSnap = (
  id: string,
  data: Record<string, unknown>,
): UserReward => ({
  id,
  userId: String(data.userId),
  rewardId: String(data.rewardId),
  title: String(data.title),
  cost: Number(data.cost ?? 0),
  creatorUserId: String(data.creatorUserId),
  createdAt: toIso(data.createdAt as Timestamp) ?? new Date().toISOString(),
});

export async function createReward(
  uid: string,
  title: string,
  cost: number,
): Promise<void> {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("Reward title cannot be empty");
  }
  if (!Number.isFinite(cost) || cost <= 0) {
    throw new Error("Cost must be greater than zero");
  }

  const rewardRef = await addDoc(collection(db, "rewards"), {
    creatorUserId: uid,
    title: trimmedTitle,
    cost: Math.floor(cost),
    subscriberCount: 0,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, "userRewards"), {
    userId: uid,
    rewardId: rewardRef.id,
    title: trimmedTitle,
    cost: Math.floor(cost),
    creatorUserId: uid,
    createdAt: serverTimestamp(),
  });
}

export function subscribeUserRewards(
  uid: string,
  onData: (rewards: UserReward[]) => void,
): () => void {
  const q = query(
    collection(db, "userRewards"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((entry) =>
        userRewardFromSnap(entry.id, entry.data() as Record<string, unknown>),
      ),
    );
  });
}

export function subscribePopularRewards(
  onData: (rewards: Reward[]) => void,
): () => void {
  const q = query(
    collection(db, "rewards"),
    orderBy("subscriberCount", "desc"),
    limit(50),
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((entry) =>
        rewardFromSnap(entry.id, entry.data() as Record<string, unknown>),
      ),
    );
  });
}

export async function addRewardToStore(
  uid: string,
  reward: Reward,
): Promise<void> {
  const existingQ = query(
    collection(db, "userRewards"),
    where("userId", "==", uid),
    where("rewardId", "==", reward.id),
    limit(1),
  );
  const existing = await getDocs(existingQ);
  if (!existing.empty) {
    throw new Error("Reward is already in your store");
  }

  const rewardRef = doc(db, "rewards", reward.id);
  await runTransaction(db, async (tx) => {
    const rewardSnap = await tx.get(rewardRef);
    if (!rewardSnap.exists()) {
      throw new Error("Reward not found");
    }
    const data = rewardSnap.data();
    tx.set(doc(collection(db, "userRewards")), {
      userId: uid,
      rewardId: reward.id,
      title: String(data.title),
      cost: Number(data.cost ?? 0),
      creatorUserId: String(data.creatorUserId),
      createdAt: serverTimestamp(),
    });
    if (String(data.creatorUserId) !== uid) {
      tx.update(rewardRef, { subscriberCount: increment(1) });
    }
  });
}

export async function redeemReward(
  uid: string,
  userReward: UserReward,
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    const balance = Number(userSnap.data().balance ?? 0);
    if (balance < userReward.cost) {
      throw new Error("Not enough balance");
    }
    tx.update(userRef, { balance: increment(-userReward.cost) });
    tx.set(doc(collection(db, "walletLedger")), {
      userId: uid,
      delta: -userReward.cost,
      reason: "reward_redeem",
      rewardId: userReward.rewardId,
      createdAt: serverTimestamp(),
    });
  });
}

export function subscribeLeaderboard(
  onData: (rows: LeaderboardEntry[]) => void,
): () => void {
  const q = query(
    collection(db, "users"),
    orderBy("balance", "desc"),
    limit(20),
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          handle: String(data.handle ?? "anonymous"),
          balance: Number(data.balance ?? 0),
        };
      }),
    );
  });
}
