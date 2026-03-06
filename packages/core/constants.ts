// packages/core/constants.ts

export const GBX = {
  // Default address format for the app
  DEFAULT_ADDRESS_MODE: "bech32" as const, // bn1...
  BECH32_HRP: "bn",
};

// Protocol fee: 0.10% (10 bps) burned to a hard-locked burn address.
// No project wallet, no admin keys.
export const PROTOCOL_FEE = {
  BPS: 10, // 0.10%
  MIN_FEE_SAT: 1,
  BURN_ADDRESS: "CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS",
} as const;

// Seed bootstrap endpoints (public)
export const SEEDS = [
  "89.167.125.117:39444",
  "89.167.36.203:39444",
] as const;

// USDC network selector (MVP)
export type UsdcNetwork = "arbitrum" | "base" | "polygon" | "solana";
export const USDC_NETWORKS: readonly UsdcNetwork[] = [
  "arbitrum",
  "base",
  "polygon",
  "solana",
] as const;
