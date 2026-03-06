// packages/core/swap-engine/state.ts

export type SwapRole = "maker" | "taker";

/**
 * Atomic swap lifecycle (high-level):
 * OFFER -> LOCK_GBX -> LOCK_USDC -> CLAIM_USDC (reveals secret) -> CLAIM_GBX -> DONE
 * Fallbacks after timeouts: REFUND_USDC / REFUND_GBX.
 */
export type SwapPhase =
  | "OFFER"
  | "LOCK_GBX"
  | "LOCK_USDC"
  | "CLAIM_USDC"
  | "CLAIM_GBX"
  | "REFUND_USDC"
  | "REFUND_GBX"
  | "DONE"
  | "FAILED";

export type SwapChain = "gbx" | "evm" | "solana";

export type SwapIds = {
  offerId: string; // nostr event id (or internal id)
  swapId: string;  // local UUID
};

export type HtlcParams = {
  hash: string;           // hash of secret (hex)
  secret?: string;        // revealed at CLAIM_USDC stage (hex)
  timeoutGbx: number;     // unix seconds
  timeoutUsdc: number;    // unix seconds
};

export type Amounts = {
  gbxGrossSat: bigint;
  gbxFeeSat: bigint;
  gbxNetSat: bigint;
  usdcAmount: string; // decimal string (6 decimals for USDC)
  usdcNetwork: "arbitrum" | "base" | "polygon" | "solana";
};

export type TxRefs = {
  // GBX
  gbxLockTxId?: string;
  gbxClaimTxId?: string;
  gbxRefundTxId?: string;

  // USDC side (EVM/Solana)
  usdcLockId?: string;   // contract lockId or program escrow id
  usdcClaimTx?: string;  // tx hash / signature
  usdcRefundTx?: string; // tx hash / signature
};

export type SwapState = {
  ids: SwapIds;
  role: SwapRole;
  phase: SwapPhase;
  createdAt: number; // unix seconds
  updatedAt: number; // unix seconds

  htlc: HtlcParams;
  amounts: Amounts;
  tx: TxRefs;

  lastError?: string;
};

export function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

export function initSwapState(args: {
  offerId: string;
  swapId: string;
  role: SwapRole;
  htlc: HtlcParams;
  amounts: Amounts;
}): SwapState {
  const t = nowSec();
  return {
    ids: { offerId: args.offerId, swapId: args.swapId },
    role: args.role,
    phase: "OFFER",
    createdAt: t,
    updatedAt: t,
    htlc: args.htlc,
    amounts: args.amounts,
    tx: {},
  };
}

export function transition(state: SwapState, next: SwapPhase, patch?: Partial<SwapState>): SwapState {
  const t = nowSec();
  return {
    ...state,
    ...patch,
    phase: next,
    updatedAt: t,
  };
}

/**
 * Guardrails for timeouts:
 * Typically: timeoutUSDC < timeoutGBX, so if USDC side refunds, GBX side still refundable later.
 */
export function validateTimeoutOrder(timeoutUsdc: number, timeoutGbx: number): void {
  if (timeoutUsdc <= 0 || timeoutGbx <= 0) throw new Error("timeouts must be > 0");
  if (timeoutUsdc >= timeoutGbx) {
    throw new Error("invalid timeout order: timeoutUsdc must be < timeoutGbx");
  }
}
