# GOLDBRIX ONE

Official non-custodial Android wallet for the GOLDBRIX network.

GOLDBRIX ONE is designed to give users direct control over their wallet, seed phrase, and on-chain funds.

## Download APK

[Download GOLDBRIX ONE APK (v1.0.1 Preview Fixed)](https://github.com/richlifeguideonly-prog/goldbrix-one/releases/download/v1.0.1-preview/goldbrix-one-v1.0.1-preview-fixed.apk)

## Release Page

[Open Release Notes](https://github.com/richlifeguideonly-prog/goldbrix-one/releases/tag/v1.0.1-preview)

## Explorer

[Open Explorer](https://89-167-36-203.sslip.io/explorer/)

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

- Core (TypeScript): fee logic, transaction flow, validations
- GBX wallet utilities: bech32 handling and wallet helpers
- Mobile app (Expo): Android wallet interface and release build
- Explorer integration: public chain visibility and transaction lookup

## Network Bootstrap

- `89.167.125.117:39444`
- `89.167.36.203:39444`

## Repository Structure

- `apps/mobile` — Expo-based Android wallet app
- `packages/core` — core wallet and transaction logic
- `server` — backend and operational components
- `docs` — project and release documentation
