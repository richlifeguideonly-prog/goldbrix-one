const http = require('http');
const { exec } = require('child_process');

const HOST = '0.0.0.0';
const PORT = 8088;

const CLI = process.env.GBX_CLI || 'goldbrix-cli';
const RPC_CONNECT = process.env.GBX_RPC_CONNECT || '127.0.0.1';
const RPC_PORT = process.env.GBX_RPC_PORT || '8332';
const DATADIR = process.env.GBX_DATADIR || '/root/goldbrix_mainnet/node1';

function runCli(args) {
  return new Promise((resolve, reject) => {
    const cmd = `${CLI} -rpcconnect=${RPC_CONNECT} -rpcport=${RPC_PORT} -datadir=${DATADIR} ${args}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function sendJson(res, code, payload) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2));
}

async function getStatus() {
  const blockchain = JSON.parse(await runCli('getblockchaininfo'));
  const peers = Number(await runCli('getconnectioncount'));

  return {
    network: blockchain.chain || 'goldbrix-mainnet',
    best_block_height: blockchain.blocks ?? 0,
    best_block_hash: blockchain.bestblockhash ?? '',
    peer_count: peers,
    synced: blockchain.initialblockdownload === false,
    updated_at: Math.floor(Date.now() / 1000),
  };
}

async function getAddressSummary(address) {
  let balanceSats = 0;
  let txCount = 0;
  let lastTxid = null;

  try {
    const receivedRaw = await runCli(`getreceivedbyaddress "${address}" 0`);
    const received = Number(receivedRaw || '0');
    balanceSats = Math.round(received * 100000000);
  } catch (_) {}

  try {
    const addrInfoRaw = await runCli(`getaddressinfo "${address}"`);
    const addrInfo = JSON.parse(addrInfoRaw);

    if (addrInfo.labels && Array.isArray(addrInfo.labels)) {
      txCount = addrInfo.labels.length;
    }
  } catch (_) {}

  return {
    network: 'goldbrix-mainnet',
    address,
    balance_sats: balanceSats,
    balance_gbx: (balanceSats / 100000000).toFixed(8),
    tx_count: txCount,
    last_txid: lastTxid,
    updated_at: Math.floor(Date.now() / 1000),
  };
}

async function getAddressTxs(address) {
  return {
    address,
    items: [],
  };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/status') {
      const data = await getStatus();
      sendJson(res, 200, data);
      return;
    }

    const addressMatch = url.pathname.match(/^\/api\/address\/([^/]+)$/);
    if (addressMatch) {
      const address = decodeURIComponent(addressMatch[1]);
      const data = await getAddressSummary(address);
      sendJson(res, 200, data);
      return;
    }

    const txMatch = url.pathname.match(/^\/api\/address\/([^/]+)\/txs$/);
    if (txMatch) {
      const address = decodeURIComponent(txMatch[1]);
      const data = await getAddressTxs(address);
      sendJson(res, 200, data);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`GOLDBRIX read-only API listening on http://${HOST}:${PORT}`);
});
