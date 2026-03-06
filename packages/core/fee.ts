// packages/core/fee.ts
import { PROTOCOL_FEE } from "./constants";

export type FeeCalc = {
  grossSat: bigint; // user amount (gross) in satoshis
  feeSat: bigint;   // protocol fee in satoshis
  netSat: bigint;   // amount locked in HTLC (gross - fee)
  feeBps: number;
  burnAddress: string;
};

/**
 * Calculate protocol fee in satoshis.
 * - fee = ceil(gross * bps / 10000)
 * - minimum 1 sat
 * - rejects gross <= fee
 */
export function calcProtocolFee(grossSat: bigint): FeeCalc {
  if (grossSat <= 0n) throw new Error("grossSat must be > 0");

  const bps = BigInt(PROTOCOL_FEE.BPS);
  const denom = 10_000n;

  // ceilDiv(a*b, denom)
  const numerator = grossSat * bps;
  let feeSat = numerator / denom;
  if (numerator % denom !== 0n) feeSat += 1n;

  if (feeSat < BigInt(PROTOCOL_FEE.MIN_FEE_SAT)) {
    feeSat = BigInt(PROTOCOL_FEE.MIN_FEE_SAT);
  }

  const netSat = grossSat - feeSat;
  if (netSat <= 0n) {
    throw new Error("grossSat too small after fee");
  }

  return {
    grossSat,
    feeSat,
    netSat,
    feeBps: PROTOCOL_FEE.BPS,
    burnAddress: PROTOCOL_FEE.BURN_ADDRESS,
  };
}

/**
 * Quick helper: ensure a given (feeSat, burnAddr) matches current protocol rules.
 */
export function assertFeePolicy(feeSat: bigint, burnAddress: string): void {
  if (burnAddress !== PROTOCOL_FEE.BURN_ADDRESS) {
    throw new Error("invalid burn address");
  }
  if (feeSat < BigInt(PROTOCOL_FEE.MIN_FEE_SAT)) {
    throw new Error("fee below minimum");
  }
}
