// packages/core/nostr/offers.ts
import { PROTOCOL_FEE, SEEDS, type UsdcNetwork } from "../constants";
import { calcProtocolFee } from "../fee";

export type GbxUsdcOffer = {
  v: 1;
  kind: "GBX_USDC_OFFER";

  // market
  pair: "GBX/USDC";
  usdcNetwork: UsdcNetwork;

  // amounts
  gbxGrossSat: string; // bigint serialized as string
  gbxFeeSat: string;   // bigint serialized as string
  gbxNetSat: string;   // bigint serialized as string
  usdcAmount: string;  // decimal string (6 decimals)

  // fee policy (verifiable)
  feeBps: number;       // 10
  feeReceiver: string;  // burn address

  // HTLC
  hash: string;         // hex (hash of secret)
  timeoutUsdc: number;  // unix seconds
  timeoutGbx: number;   // unix seconds

  // meta
  expiry: number;       // unix seconds
  createdAt: number;    // unix seconds

  // bootstrap hints (no private data)
  seeds: readonly string[];
};

export function buildOffer(args: {
  usdcNetwork: UsdcNetwork;
  gbxGrossSat: bigint;
  usdcAmount: string;
  hash: string;
  timeoutUsdc: number;
  timeoutGbx: number;
  expiry: number;
  createdAt: number;
}): GbxUsdcOffer {
  const fee = calcProtocolFee(args.gbxGrossSat);

  return {
    v: 1,
    kind: "GBX_USDC_OFFER",
    pair: "GBX/USDC",
    usdcNetwork: args.usdcNetwork,

    gbxGrossSat: fee.grossSat.toString(),
    gbxFeeSat: fee.feeSat.toString(),
    gbxNetSat: fee.netSat.toString(),
    usdcAmount: args.usdcAmount,

    feeBps: PROTOCOL_FEE.BPS,
    feeReceiver: PROTOCOL_FEE.BURN_ADDRESS,

    hash: args.hash,
    timeoutUsdc: args.timeoutUsdc,
    timeoutGbx: args.timeoutGbx,

    expiry: args.expiry,
    createdAt: args.createdAt,

    seeds: SEEDS,
  };
}

export function isValidOfferFee(offer: GbxUsdcOffer): boolean {
  return (
    offer.feeBps === PROTOCOL_FEE.BPS &&
    offer.feeReceiver === PROTOCOL_FEE.BURN_ADDRESS
  );
}
