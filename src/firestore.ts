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
type BetSettlementDoc = {
  bettorUserId: string;
  side: BetSide;
  stake: number;
  ref: DocumentReference;
};

const toIso = (value: Timestamp | null | undefined): string | null =>
  value ? value.toDate().toISOString() : null;

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
    onData(
      snap.docs.map((entry) =>
        choreFromSnap(entry.id, entry.data() as Record<string, unknown>),
      ),
    );
  });
}

export async function createTodo(
  uid: string,
  title: string,
  expiresAtIso: string,
): Promise<void> {
  await addDoc(collection(db, "chores"), {
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
}

export async function completeTodo(
  uid: string,
  choreId: string,
): Promise<void> {
  const ref = doc(db, "chores", choreId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().ownerUserId !== uid) {
    return;
  }
  await updateDoc(ref, {
    status: "completed",
    completedAt: serverTimestamp(),
  });
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
    onData(
      snap.docs.map((entry) =>
        choreFromSnap(entry.id, entry.data() as Record<string, unknown>),
      ),
    );
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
    onData(
      snap.docs.map((entry) =>
        betFromSnap(entry.id, entry.data() as Record<string, unknown>),
      ),
    );
  });
}

export async function getRandomCandidate(uid: string): Promise<Chore | null> {
  const now = new Date();
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
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
    .filter((item) => item.ownerUserId !== uid);
  if (filtered.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * filtered.length);
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
  const userRef = doc(db, "users", uid);
  const choreRef = doc(db, "chores", chore.id);

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

    tx.update(userRef, { balance: increment(-stake) });
    tx.update(choreRef, {
      totalPool: increment(stake),
      totalOnComplete: side === "complete" ? increment(stake) : increment(0),
      totalOnFail: side === "fail" ? increment(stake) : increment(0),
    });

    tx.set(doc(collection(db, "bets")), {
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
      createdAt: serverTimestamp(),
    });
  });
}

export async function settleExpiredChores(): Promise<void> {
  const now = Timestamp.fromDate(new Date());
  const choresQ = query(
    collection(db, "chores"),
    where("settledAt", "==", null),
    where("expiresAt", "<=", now),
    limit(20),
  );
  const chores = await getDocs(choresQ);

  for (const choreDoc of chores.docs) {
    await runTransaction(db, async (tx) => {
      const freshChore = await tx.get(choreDoc.ref);
      if (!freshChore.exists()) return;
      const choreData = freshChore.data();
      if (choreData.settledAt) return;

      const winsOnComplete =
        choreData.status === "completed" &&
        choreData.completedAt &&
        (choreData.completedAt as Timestamp).toMillis() <=
          (choreData.expiresAt as Timestamp).toMillis();
      const winningSide: BetSide = winsOnComplete ? "complete" : "fail";

      const betsQ = query(
        collection(db, "bets"),
        where("choreId", "==", choreDoc.id),
        where("status", "==", "open"),
      );
      const betsSnap = await getDocs(betsQ);
      const bets: BetSettlementDoc[] = betsSnap.docs.map((entry) => {
        const data = entry.data();
        return {
          ref: entry.ref,
          bettorUserId: String(data.bettorUserId),
          side: data.side as BetSide,
          stake: Number(data.stake),
        };
      });
      const totalWinningStake = bets
        .filter((bet) => bet.side === winningSide)
        .reduce((sum, bet) => sum + Number(bet.stake), 0);
      const totalLosingStake = bets
        .filter((bet) => bet.side !== winningSide)
        .reduce((sum, bet) => sum + Number(bet.stake), 0);

      for (const bet of bets) {
        const won = bet.side === winningSide;
        const payout =
          won && totalWinningStake > 0
            ? Number(bet.stake) +
              Math.floor(
                (Number(bet.stake) / totalWinningStake) * totalLosingStake,
              )
            : 0;
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
            reason: "bet_payout",
            createdAt: serverTimestamp(),
          });
        }
      }

      tx.update(choreDoc.ref, { settledAt: serverTimestamp() });
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
