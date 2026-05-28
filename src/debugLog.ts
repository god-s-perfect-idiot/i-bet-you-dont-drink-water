/** Console logs for debugging chores/bets — filter DevTools by `[ibydw]` */

export type DebugScope = "chore" | "bet" | "settle" | "app";

export function debugLog(
  scope: DebugScope,
  message: string,
  data?: Record<string, unknown>,
): void {
  console.log(`[ibydw:${scope}]`, message, {
    at: new Date().toISOString(),
    ...data,
  });
}

export function debugChoreSummary(chores: {
  id: string;
  title?: string;
  status: string;
  settledAt: string | null;
  completedAt: string | null;
  expiresAt: string;
  totalPool?: number;
}[]): Record<string, unknown>[] {
  return chores.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    settledAt: c.settledAt,
    completedAt: c.completedAt,
    expiresAt: c.expiresAt,
    totalPool: c.totalPool,
  }));
}

export function debugBetSummary(bets: {
  id: string;
  choreId: string;
  side: string;
  stake: number;
  status: string;
  payout: number;
  settledAt: string | null;
}[]): Record<string, unknown>[] {
  return bets.map((b) => ({
    id: b.id,
    choreId: b.choreId,
    side: b.side,
    stake: b.stake,
    status: b.status,
    payout: b.payout,
    settledAt: b.settledAt,
  }));
}
