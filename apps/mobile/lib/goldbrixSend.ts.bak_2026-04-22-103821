import { bech32, hex } from '@scure/base';
import * as btc from '@scure/btc-signer';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { secp256k1 } from '@noble/curves/secp256k1';

const HRP = 'bn';
const DERIVATION_PATH = "m/84'/0'/0'/0/0";
const DUST_LIMIT = 546n;
const DEFAULT_FEE_RATE = 2n;

export type ApiUtxo = {
  txid: string;
  vout: number;
  amount_sats: number;
  amount_gbx?: string;
  confirmations?: number | null;
  coinbase?: boolean;
  spendable?: boolean;
  script_pub_key: string;
};

export type SignedSendResult = {
  rawtx: string;
  txid: string;
  feeSats: string;
  changeSats: string;
  spendSats: string;
  inputCount: number;
};

function parseAmountToSats(amount: string): bigint {
  const normalized = amount.trim().replace(',', '.');

  if (!/^\d+(\.\d{1,8})?$/.test(normalized)) {
    throw new Error('Invalid amount format');
  }

  const [whole, frac = ''] = normalized.split('.');
  const fracPadded = (frac + '00000000').slice(0, 8);

  return BigInt(whole) * 100000000n + BigInt(fracPadded);
}

function derivePrivateKeyFromMnemonic(mnemonic: string): Uint8Array {
  const clean = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
  const seed = mnemonicToSeedSync(clean);
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(DERIVATION_PATH);

  if (!child.privateKey) {
    throw new Error('Missing derived private key');
  }

  return child.privateKey;
}

function ownP2WPKHScript(privKey: Uint8Array): Uint8Array {
  const pubKey = secp256k1.getPublicKey(privKey, true);
  return btc.p2wpkh(pubKey).script;
}

function bnAddressToScript(address: string): Uint8Array {
  const decoded = bech32.decode(address);

  if (decoded.prefix !== HRP) {
    throw new Error('Only bn1 addresses are supported in this first real-send step');
  }

  const words = decoded.words;
  const version = words[0];

  if (version !== 0) {
    throw new Error('Only witness version 0 is supported right now');
  }

  const program = Uint8Array.from(bech32.fromWords(words.slice(1)));

  if (program.length !== 20) {
    throw new Error('Only P2WPKH bn1 addresses are supported right now');
  }

  return Uint8Array.from([0x00, 0x14, ...program]);
}

function estimateP2WPKHFee(inputCount: number, outputCount: number, feeRate: bigint = DEFAULT_FEE_RATE): bigint {
  const vbytes = BigInt(10 + inputCount * 68 + outputCount * 31);
  return vbytes * feeRate;
}

function selectSpendableUtxos(utxos: ApiUtxo[], targetSats: bigint) {
  const spendable = utxos
    .filter((u) => u.spendable === true && Number(u.amount_sats || 0) > 0)
    .sort((a, b) => Number(a.amount_sats) - Number(b.amount_sats));

  if (!spendable.length) {
    throw new Error('No spendable UTXOs available yet');
  }

  const selected: ApiUtxo[] = [];
  let total = 0n;

  for (const utxo of spendable) {
    selected.push(utxo);
    total += BigInt(utxo.amount_sats);

    const feeWithChange = estimateP2WPKHFee(selected.length, 2);

    if (total >= targetSats + feeWithChange) {
      break;
    }
  }

  let fee = estimateP2WPKHFee(selected.length, 2);

  if (total < targetSats + fee) {
    throw new Error('Not enough spendable balance');
  }

  let change = total - targetSats - fee;

  if (change <= DUST_LIMIT) {
    fee = total - targetSats;
    change = 0n;
  }

  return {
    selected,
    fee,
    change,
  };
}

export function buildSignedRawTx(params: {
  mnemonic: string;
  toAddress: string;
  amountGbx: string;
  utxos: ApiUtxo[];
}): SignedSendResult {
  const { mnemonic, toAddress, amountGbx, utxos } = params;

  const spendSats = parseAmountToSats(amountGbx);

  if (spendSats <= 0n) {
    throw new Error('Amount must be greater than zero');
  }

  const privKey = derivePrivateKeyFromMnemonic(mnemonic);
  const changeScript = ownP2WPKHScript(privKey);
  const destinationScript = bnAddressToScript(toAddress);

  const { selected, fee, change } = selectSpendableUtxos(utxos, spendSats);

  const tx = new btc.Transaction();

  for (const utxo of selected) {
    tx.addInput({
      txid: hex.decode(utxo.txid),
      index: utxo.vout,
      witnessUtxo: {
        script: hex.decode(utxo.script_pub_key),
        amount: BigInt(utxo.amount_sats),
      },
    });
  }

  tx.addOutput({
    script: destinationScript,
    amount: spendSats,
  });

  if (change > 0n) {
    tx.addOutput({
      script: changeScript,
      amount: change,
    });
  }

  tx.sign(privKey);
  tx.finalize();

  return {
    rawtx: tx.hex,
    txid: tx.id,
    feeSats: fee.toString(),
    changeSats: change.toString(),
    spendSats: spendSats.toString(),
    inputCount: selected.length,
  };
}
