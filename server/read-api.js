const http = require('http');
const { exec } = require('child_process');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8088;

const CLI = process.env.GBX_CLI || '/root/goldbrix_bin/bitcoin-cli';
const RPC_CONNECT = process.env.GBX_RPC_CONNECT || '127.0.0.1';
const RPC_PORT = process.env.GBX_RPC_PORT || '8332';
const DATADIR = process.env.GBX_DATADIR || '/root/goldbrix_mainnet/node2';

function runCli(args) {
  return new Promise((resolve, reject) => {
    const cmd = `${CLI} -rpcconnect=${RPC_CONNECT} -rpcport=${RPC_PORT} -datadir=${DATADIR} ${args}`;
    exec(cmd, { maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error((stderr || error.message).trim()));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function sendJson(res, code, payload) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload, null, 2));
}

function gbxToSats(amount) {
  return Math.round(Number(amount || 0) * 100000000);
}

function normalizeNetwork(chain) {
  if (chain === 'main') return 'goldbrix-mainnet';
  return chain || 'goldbrix-mainnet';
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1024 * 1024) reject(new Error('Request body too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function getStatus() {
  const blockchain = JSON.parse(await runCli('getblockchaininfo'));
  const peers = Number(await runCli('getconnectioncount'));

  return {
    network: normalizeNetwork(blockchain.chain),
    best_block_height: blockchain.blocks ?? 0,
    best_block_hash: blockchain.bestblockhash ?? '',
    peer_count: peers,
    synced: blockchain.initialblockdownload === false,
    updated_at: Math.floor(Date.now() / 1000),
  };
}

async function validateAddress(address) {
  const raw = await runCli(`validateaddress "${address}"`);
  const info = JSON.parse(raw);

  if (!info.isvalid) throw new Error('Address is not valid');
  if (!info.scriptPubKey) throw new Error('Missing scriptPubKey');

  return info;
}

async function scanAddress(address) {
  const info = await validateAddress(address);
  const scanRaw = await runCli(`scantxoutset start '["raw(${info.scriptPubKey})"]'`);
  const scan = JSON.parse(scanRaw);
  return { info, scan };
}

function summarizeUnspents(unspents) {
  let total = 0;
  let spendable = 0;
  let immature = 0;

  for (const u of unspents) {
    const amt = Number(u.amount || 0);
    const conf = Number(u.confirmations || 0);
    const coinbase = !!u.coinbase;
    const isSpendable = !coinbase || conf >= 100;

    total += amt;
    if (isSpendable) spendable += amt;
    else immature += amt;
  }

  return {
    total,
    spendable,
    immature,
  };
}

async function getMempoolSpentOutpoints() {
  const raw = await runCli('getrawmempool true');
  const mp = JSON.parse(raw || '{}');
  const spent = new Set();

  for (const txid of Object.keys(mp)) {
    try {
      const tx = JSON.parse(await runCli(`getrawtransaction "${txid}" true`));
      const vin = Array.isArray(tx.vin) ? tx.vin : [];
      for (const input of vin) {
        if (input && input.txid && Number.isInteger(input.vout)) {
          spent.add(`${input.txid}:${input.vout}`);
        }
      }
    } catch (_) {}
  }

  return spent;
}

async function getAddressSummary(address) {
  const { scan } = await scanAddress(address);
  const chainUnspents = Array.isArray(scan.unspents) ? scan.unspents : [];
  const mempoolSpent = await getMempoolSpentOutpoints();

  const unspents = chainUnspents.map((u) => {
    const confirmations = Number(u.confirmations || 0);
    const coinbase = !!u.coinbase;
    const mature = !coinbase || confirmations >= 100;
    const spentInMempool = mempoolSpent.has(`${u.txid}:${u.vout}`);
    return {
      ...u,
      confirmations,
      coinbase,
      spendable: mature && !spentInMempool,
      rawtx_hex: '',
    };
  });

  const total = unspents.reduce((sum, u) => sum + Number(u.amount || 0), 0);
  const spendable = unspents.reduce((sum, u) => sum + (u.spendable ? Number(u.amount || 0) : 0), 0);
  const immature = Math.max(0, total - spendable);

  const utxoCount = unspents.length;
  const lastTxid = utxoCount > 0 ? (unspents[0].txid || null) : null;

  return {
    network: 'goldbrix-mainnet',
    address,
    balance_sats: gbxToSats(total),
    balance_gbx: total.toFixed(8),

    total_sats: gbxToSats(total),
    total_gbx: total.toFixed(8),

    spendable_sats: gbxToSats(spendable),
    spendable_gbx: spendable.toFixed(8),

    immature_sats: gbxToSats(immature),
    immature_gbx: immature.toFixed(8),

    tx_count: utxoCount,
    utxo_count: utxoCount,
    last_txid: lastTxid,
    updated_at: Math.floor(Date.now() / 1000),
    unspents,
    txouts: unspents,
  };
}

async function getTxVerboseAtHeight(txid, height) {
  const h = Number(height || 0);
  if (!(h > 0)) return null;
  const blockhash = await runCli(`getblockhash ${h}`);
  return JSON.parse(await runCli(`getrawtransaction "${txid}" true "${blockhash}"`));
}

async function getAddressTxs(address) {
  const { scan, info } = await scanAddress(address);
  const unspents = Array.isArray(scan.unspents) ? scan.unspents : [];
  const tip = Number(await runCli('getblockcount'));

  const items = [];
  for (const u of unspents) {
    const height = Number(u.height || 0);
    const tx = await getTxVerboseAtHeight(u.txid, height);

    const confirmations =
      tx && Number.isFinite(Number(tx.confirmations))
        ? Number(tx.confirmations)
        : (height > 0 ? Math.max(0, tip - height + 1) : 0);

    const coinbase = !!(tx && Array.isArray(tx.vin) && tx.vin[0] && tx.vin[0].coinbase);
    const spendable = !coinbase || confirmations >= 100;

    items.push({
      txid: String(u.txid),
      vout: Number(u.vout ?? 0),
      amount_sats: gbxToSats(u.amount),
      amount_gbx: Number(u.amount || 0).toFixed(8),
      confirmations,
      coinbase,
      spendable,
      height: height || null,
      blockhash: tx?.blockhash ?? null,
      script_pub_key: info.scriptPubKey ?? '',
      rawtx_hex: tx?.hex ?? '',
    });
  }

  return items;
}

async function broadcastRawTx(rawtx) {
  if (!rawtx || typeof rawtx !== 'string') {
    throw new Error('Missing rawtx');
  }

  const txid = await runCli(`sendrawtransaction "${rawtx}"`);
  return {
    ok: true,
    txid,
    updated_at: Math.floor(Date.now() / 1000),
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/status') {
      return sendJson(res, 200, await getStatus());
    }

    const addressMatch = url.pathname.match(/^\/api\/address\/([^/]+)$/);
    if (req.method === 'GET' && addressMatch) {
      const address = decodeURIComponent(addressMatch[1]);
      return sendJson(res, 200, await getAddressSummary(address));
    }

    const txMatch = url.pathname.match(/^\/api\/address\/([^/]+)\/txs$/);
    if (req.method === 'GET' && txMatch) {
      const address = decodeURIComponent(txMatch[1]);
      return sendJson(res, 200, await getAddressTxs(address));
    }

    if (req.method === 'POST' && url.pathname === '/api/broadcast') {
      const rawBody = await readBody(req);
      const body = JSON.parse(rawBody || '{}');
      return sendJson(res, 200, await broadcastRawTx(body.rawtx));
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('READ_API_ERROR', {
      method: req.method,
      url: req.url,
      message: err?.message,
      stack: err?.stack,
    });
    return sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`GOLDBRIX API listening on http://${HOST}:${PORT}`);
});
