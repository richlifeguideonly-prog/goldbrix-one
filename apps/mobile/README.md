# GOLDBRIX ONE — Mobile (Expo)

Mobile-first app:
- GBX wallet (non-custodial)
- USDC network selector (Arbitrum / Base / Polygon / Solana)
- Atomic swap engine (HTLC)
- P2P orderbook (Nostr MVP)
- Miner monitor (desktop miner is separate)

## Requirements
- Node.js 20+
- npm or pnpm
- Expo Go (phone) or Android Studio / Xcode (optional)

## Create the app (MVP)
From repo root:
``bash
npx create-expo-app@latest apps/mobile --template blank-typescript
cd apps/mobile
npx expo start



Notes


Default GBX address format: bech32 bn1...
Protocol fee: 10 bps (0.10%) burned to: CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS
Seeds:
89.167.125.117:39444
89.167.36.203:39444
