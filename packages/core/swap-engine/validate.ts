// packages/core/swap-engine/validate.ts
import { calcProtocolFee } from "../fee";
import { PROTOCOL_FEE } from "../constants";

/**
 * Minimal TX output model used by the swap-engine validator.
 * The GBX transaction builder will map real tx/psbt outputs into this structure.
 */
export type GbxTxOutput = {
  // For MVP we validate by decoded destination string + amount.
  // Destination should be the burn address string or a special tag for the HTLC output.
  to: string;        // e.g. "CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS" or "HTLC"
  valueSat: bigint;  // satoshis
};

export type ValidateGbxLockArgs = {
  gbxGrossSat: bigint;
  outputs: GbxTxOutput[];
};

/**
 * Enforce protocol fee burn on GBX lock transaction:
 * - Must include an output to burn address with >= feeSat
 * - Must include the HTLC output with exactly netSat
 *
 * Note: Some tx builders may add additional outputs (e.g. change). That's fine.
 * This validator only enforces the burn fee and the HTLC amount.
 */
export function validateGbxLockTx(args: ValidateGbxLockArgs): {
  feeSat: bigint;
  netSat: bigint;
} {
  const { feeSat, netSat } = calcProtocolFee(args.gbxGrossSat);

  // 1) burn output
  const burnOut = args.outputs.find((o) => o.to === PROTOCOL_FEE.BURN_ADDRESS);
  if (!burnOut) throw new Error("missing burn output");
  if (burnOut.valueSat < feeSat) throw new Error("burn output below required fee");

  // 2) HTLC output
  const htlcOut = args.outputs.find((o) => o.to === "HTLC");
  if (!htlcOut) throw new Error("missing HTLC output");
  if (htlcOut.valueSat !== netSat) throw new Error("HTLC output amount mismatch");

  return { feeSat, netSat };
}

/**
 * Optional: quick sanity check that burn address is hard-locked as intended.
 */
export function assertProtocolBurnAddress(addr: string): void {
  if (addr !== PROTOCOL_FEE.BURN_ADDRESS) {
    throw new Error("invalid protocol burn address");
  }
}
