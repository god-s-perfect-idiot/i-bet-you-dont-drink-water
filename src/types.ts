export type ChoreStatus = "open" | "completed";
export type BetSide = "complete" | "fail";
export type BetStatus = "open" | "won" | "lost";

export interface UserProfile {
  id: string;
  handle: string;
  startingBalance: number;
  balance: number;
  createdAt: string;
}

export interface Chore {
  id: string;
  ownerUserId: string;
  title: string;
  expiresAt: string;
  completedAt: string | null;
  status: ChoreStatus;
  settledAt: string | null;
  totalOnComplete: number;
  totalOnFail: number;
  totalPool: number;
}

export interface Bet {
  id: string;
  bettorUserId: string;
  choreId: string;
  side: BetSide;
  stake: number;
  status: BetStatus;
  settledAt: string | null;
  createdAt: string;
  payout: number;
}

export interface LeaderboardEntry {
  id: string;
  handle: string;
  balance: number;
}

export interface Reward {
  id: string;
  creatorUserId: string;
  title: string;
  cost: number;
  subscriberCount: number;
  createdAt: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  title: string;
  cost: number;
  creatorUserId: string;
  createdAt: string;
}
