# GOLDBRIX Read-Only API

## Purpose

Provides the mobile app with read-only blockchain data:
- address summary
- address transactions
- node status

## Default port

8088

## Start

cd server
node read-api.js

## Environment variables

Optional:

- GBX_CLI
  default: goldbrix-cli

- GBX_RPC_CONNECT
  default: 127.0.0.1

- GBX_RPC_PORT
  default: 8332

- GBX_DATADIR
  default: /root/goldbrix_mainnet/node1

## Example

GBX_CLI=goldbrix-cli \
GBX_RPC_CONNECT=127.0.0.1 \
GBX_RPC_PORT=8332 \
GBX_DATADIR=/root/goldbrix_mainnet/node1 \
node read-api.js
