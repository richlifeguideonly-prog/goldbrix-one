# GOLDBRIX ONE (Private)

Mobile-first non-custodial wallet + swap app for GBX↔USDC.
No project wallet. No admin keys. No custody.

## Modules (MVP)
- Core (TypeScript): fee + swap state machine + validations
- GBX wallet utils: bn1 (bech32) address tools
- Nostr orderbook (MVP): offer schema (serverless)

## Protocol fee (hard-locked)
- Fee: 10 bps (0.10%) in GBX
- Burn address: CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS
- Enforcement: GBX lock tx must include burn output (fee) + HTLC output (net)

## Seeds (bootstrap)
- 89.167.125.117:39444
- 89.167.36.203:39444

## Repo structure
- `packages/core/` — core logic
- `apps/mobile/` — Expo mobile app (setup notes)
