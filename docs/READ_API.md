# GOLDBRIX Read-Only API (MVP)

Purpose: provide the mobile wallet with read-only blockchain data.

## Base URL

TBD

## Endpoint 1 — Address summary

GET `/api/address/:address`

Example:

GET `/api/address/bn1qexample...`

Response fields:
- network
- address
- balance_sats
- balance_gbx
- tx_count
- last_txid
- updated_at

Example response:
- network: goldbrix-mainnet
- address: bn1qexample...
- balance_sats: 0
- balance_gbx: 0.00000000
- tx_count: 0
- last_txid: null
- updated_at: 0

## Endpoint 2 — Address transactions

GET `/api/address/:address/txs`

Response fields:
- address
- items[]

Each item contains:
- txid
- direction
- amount_sats
- amount_gbx
- confirmations
- time

Example item:
- txid: exampletxid
- direction: in
- amount_sats: 0
- amount_gbx: 0.00000000
- confirmations: 0
- time: 0

## Endpoint 3 — Node status

GET `/api/status`

Response fields:
- network
- best_block_height
- best_block_hash
- peer_count
- synced
- updated_at

Example response:
- network: goldbrix-mainnet
- best_block_height: 0
- best_block_hash:
- peer_count: 0
- synced: false
- updated_at: 0

## Notes

- Read-only only
- No wallet keys
- No private data
- App uses this API for balance, tx history, and node sync status
