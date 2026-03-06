// packages/core/gbx-wallet/address.ts
//
// Bech32 (bn1...) address utilities for GOLDBRIX (GBX).
// Default address format in the app: native segwit P2WPKH (witness v0).
//
// Required deps (later when you run the app):
//   npm i bech32 @noble/hashes
//
// Notes:
// - P2WPKH uses bech32 (NOT bech32m).
// - witness program = HASH160(pubkey) (20 bytes)

import { bech32 } from "bech32";
import { sha256 } from "@noble/hashes/sha256";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { GBX } from "../constants";

export type AddressMode = "bech32" | "legacy";

export function hash160(bytes: Uint8Array): Uint8Array {
  return ripemd160(sha256(bytes));
}

/**
 * Encode a segwit v0 address (bech32) for a given witness program.
 * program must be 20 bytes (P2WPKH) or 32 bytes (P2WSH).
 */
export function encodeSegwitV0Address(args: {
  hrp?: string; // default "bn"
  program: Uint8Array; // 20 or 32 bytes
}): string {
  const hrp = args.hrp ?? GBX.BECH32_HRP;
  if (!(args.program.length === 20 || args.program.length === 32)) {
    throw new Error("invalid witness program length (expected 20 or 32 bytes)");
  }

  const version = 0; // segwit v0
  const words = bech32.toWords(args.program);
  // prepend version as a 5-bit word
  words.unshift(version);

  return bech32.encode(hrp, words);
}

/**
 * Convert a compressed secp256k1 public key (33 bytes) into a bn1... P2WPKH address.
 */
export function pubkeyToBnxAddress(pubkeyCompressed: Uint8Array, hrp?: string): string {
  if (pubkeyCompressed.length !== 33) {
    throw new Error("expected compressed pubkey (33 bytes)");
  }
  const program = hash160(pubkeyCompressed); // 20 bytes
  return encodeSegwitV0Address({ hrp: hrp ?? GBX.BECH32_HRP, program });
}
