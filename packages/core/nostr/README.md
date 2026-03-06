# Nostr Orderbook (MVP)

Goal: serverless offer distribution for GBX/USDC swaps.

## Approach (MVP)
- Offers are published as Nostr events to user-selected relays.
- The app subscribes to relays and filters offers by:
  - pair = `GBX/USDC`
  - usdcNetwork (arbitrum/base/polygon/solana)
  - expiry >= now

## Offer payload
We publish a JSON object (`GbxUsdcOffer`) as the event content.

Key fields:
- `kind`: `GBX_USDC_OFFER`
- `pair`: `GBX/USDC`
- `usdcNetwork`: `arbitrum | base | polygon | solana`
- Amounts:
  - `gbxGrossSat` (string bigint)
  - `gbxFeeSat` (string bigint)
  - `gbxNetSat` (string bigint)
  - `usdcAmount` (decimal string, 6 decimals)
- Fee policy (hard-locked, verifiable):
  - `feeBps`: `10`
  - `feeReceiver`: `CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS`
- HTLC:
  - `hash` (hex)
  - `timeoutUsdc` (unix seconds)
  - `timeoutGbx` (unix seconds)
- `expiry` (unix seconds)

## Security rules
- The swap engine MUST reject offers with wrong fee policy (bps or burn address).
- The swap engine MUST validate GBX lock tx includes:
  - HTLC output = `gbxNetSat`
  - burn output to `feeReceiver` >= `gbxFeeSat`

## Relays
MVP: user can configure relays (default list later).
