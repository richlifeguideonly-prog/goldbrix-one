# GOLDBRIX ONE

Mobile-first non-custodial wallet for GOLDBRIX on Android.

GOLDBRIX ONE is designed to give users direct control over their wallet, seed phrase, and on-chain funds.

## Download APK

[Download GOLDBRIX ONE APK (v1.0.0 Preview)](https://github.com/richlifeguideonly-prog/goldbrix-one/releases/download/v1.0.0-preview/goldbrix-one.apk)

## Release Page

[Open Release Notes](https://github.com/richlifeguideonly-prog/goldbrix-one/releases/tag/v1.0.0-preview)

## APK SHA256

`ce855c29e4068de1c9772e7588a74a3c7fd9f77f205a759288a256a21ca9d6`

## Install

1. Download the APK from the link above.
2. Allow installation from unknown sources if Android asks.
3. Open the APK and install GOLDBRIX ONE.

## Core Principles

- Non-custodial wallet model
- User-controlled seed phrase
- Direct mainnet wallet functionality
- Android-first release flow

## Current Scope

GOLDBRIX ONE currently focuses on the Android wallet experience, including wallet creation, import, receive, balance display, transaction history, and real transaction broadcast.

## MVP Modules

- **Core (TypeScript):** fee logic, transaction flow, validations
- **GBX wallet utilities:** bn1 bech32 address handling and wallet helpers
- **Mobile app (Expo):** Android wallet interface and release build
- **Nostr orderbook (MVP):** offer schema foundation for future expansion

## Protocol Fee

- Fee: **10 bps (0.10%)** in GBX
- Burn address: `CRsbbtdVnietKLiaaxxDmhJfYkjtuQrqXS`
- Enforcement rule: GBX lock transaction must include burn output (fee) and HTLC output (net)

## Network Bootstrap

- `89.167.125.117:39444`
- `89.167.36.203:39444`

## Repository Structure

- `packages/core/` — core business logic
- `apps/mobile/` — Expo-based mobile wallet app


