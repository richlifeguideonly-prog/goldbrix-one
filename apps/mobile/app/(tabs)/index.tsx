import 'react-native-get-random-values';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { bech32 } from '@scure/base';
import { sha256 } from '@noble/hashes/sha2';
import { ripemd160 } from '@noble/hashes/legacy';
import { secp256k1 } from '@noble/curves/secp256k1';

import { buildSignedRawTx } from '../../lib/goldbrixSend';
import type { ApiUtxo } from '../../lib/goldbrixSend';

const HRP = 'bn';
const DERIVATION_PATH = "m/84'/0'/0'/0/0";
const STORE_KEY = 'goldbrix_wallet_v1';
const API_BASE = 'https://89-167-36-203.sslip.io/explorer-api';

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function pubkeyToGoldbrixAddress(compressedPubkeyHex: string): string {
  const pubkeyBytes = hexToBytes(compressedPubkeyHex);
  const h1 = sha256(pubkeyBytes);
  const h2 = ripemd160(h1);
  const words = [0, ...bech32.toWords(h2)];
  return bech32.encode(HRP, words);
}

function mnemonicToGoldbrixWallet(words: string) {
  const seed = mnemonicToSeedSync(words);
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive(DERIVATION_PATH);

  if (!child.privateKey) throw new Error('Missing private key');

  const pub = secp256k1.getPublicKey(child.privateKey, true);
  const pubHex = Array.from(pub).map((b) => b.toString(16).padStart(2, '0')).join('');
  const address = pubkeyToGoldbrixAddress(pubHex);

  return { address, mnemonic: words };
}

type StoredWallet = {
  address: string;
  mnemonic: string;
};

type AddressSummary = {
  network: string;
  address: string;
  balance_sats: number;
  balance_gbx: string;

  total_sats?: number;
  total_gbx?: string;

  spendable_sats?: number;
  spendable_gbx?: string;

  immature_sats?: number;
  immature_gbx?: string;

  tx_count: number;
  utxo_count?: number;
  last_txid: string | null;
  updated_at: number;
};

type AddressTxs = {
  address: string;
  items: ApiUtxo[];
};

type BroadcastResponse = {
  ok: boolean;
  txid: string;
  updated_at: number;
};

export default function HomeScreen() {
  const [address, setAddress] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [seedVisible, setSeedVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  const [receiveMode, setReceiveMode] = useState(false);

  const [sendMode, setSendMode] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);

  const [totalBalance, setTotalBalance] = useState<string>('0.00000000');
  const [spendableBalance, setSpendableBalance] = useState<string>('0.00000000');
  const [immatureBalance, setImmatureBalance] = useState<string>('0.00000000');
  const [txCount, setTxCount] = useState<number>(0);
  const [network, setNetwork] = useState<string>('goldbrix-mainnet');
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [txs, setTxs] = useState<ApiUtxo[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const raw = await SecureStore.getItemAsync(STORE_KEY);
 if (raw) {
  const parsed: StoredWallet = JSON.parse(raw);
  setAddress(parsed.address);
  setMnemonic(parsed.mnemonic);
  setTimeout(() => {
    refreshAll();
  }, 800);
}
      } catch (err) {
        console.log('caught error');
        Alert.alert('Error', 'Failed to load saved wallet');
      } finally {
        setLoaded(true);
      }
    };

    loadWallet();
  }, []);

  useEffect(() => {
  if (address) {
    void refreshAll();
  }
}, [address]);

  const saveWallet = async (wallet: StoredWallet) => {
    await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(wallet));
  };

  const fetchAddressSummary = async (walletAddress: string) => {
    try {
      setBalanceLoading(true);

      const res = await fetch(`${API_BASE}/api/address/${encodeURIComponent(walletAddress)}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: AddressSummary = await res.json();

      setTotalBalance(data.total_gbx ?? data.balance_gbx ?? '0.00000000');
      setSpendableBalance(data.spendable_gbx ?? '0.00000000');
      setImmatureBalance(data.immature_gbx ?? '0.00000000');
      setTxCount(data.tx_count ?? 0);
      setNetwork(data.network ?? 'goldbrix-mainnet');
    } catch (err) {
      console.log('wallet balance fetch failed', err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchAddressTxs = async (walletAddress: string) => {
    try {
      setTxLoading(true);

      const res = await fetch(`${API_BASE}/api/address/${encodeURIComponent(walletAddress)}/txs`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const raw: any = await res.json();
      const txList: Array<any> = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items)
        ? raw.items
        : [];
      console.log('TXS_FETCH_LEN', txList.length);
      console.log('TXS_FETCH_FIRST', JSON.stringify(txList[0] || null));
      setTxs(txList);
    } catch (err) {
      console.log('transaction history fetch failed', err);
    } finally {
      setTxLoading(false);
    }
  };

  const refreshAll = async () => {
  if (!address) return;
  await fetchAddressSummary(address);
  await fetchAddressTxs(address);
};

  const generateWallet = async () => {
    try {
      const words = generateMnemonic(wordlist);
      const wallet = mnemonicToGoldbrixWallet(words);

      await saveWallet(wallet);

      setMnemonic(wallet.mnemonic);
      setAddress(wallet.address);
      setSeedVisible(false);
      setImportMode(false);
      setImportText('');
      setReceiveMode(false);
      setSendMode(false);
      setSendAddress('');
      setSendAmount('');
      setTxs([]);

      Alert.alert('Wallet Created', 'Goldbrix wallet saved on this device');
    } catch (err) {
      console.log('caught error');
      Alert.alert('Error', 'Failed to generate Goldbrix wallet');
    }
  };

  const importWallet = async () => {
    try {
      const cleaned = importText.trim().toLowerCase().replace(/\s+/g, ' ');

      if (!validateMnemonic(cleaned, wordlist)) {
        Alert.alert('Invalid Seed Phrase', 'Please enter a valid 12 or 24 word seed phrase.');
        return;
      }

      const wallet = mnemonicToGoldbrixWallet(cleaned);
      await saveWallet(wallet);

      setMnemonic(wallet.mnemonic);
      setAddress(wallet.address);
      setSeedVisible(false);
      setImportMode(false);
      setImportText('');
      setReceiveMode(false);
      setSendMode(false);
      setSendAddress('');
      setSendAmount('');
      setTxs([]);

      Alert.alert('Wallet Imported', 'Goldbrix wallet restored successfully');
    } catch (err) {
      console.log('caught error');
      Alert.alert('Error', 'Failed to import wallet');
    }
  };

  const copyText = async (value: string | null, label: string) => {
    if (!value) return;
    await Clipboard.setStringAsync(value);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const revealSeedPhrase = () => {
    Alert.alert(
      'Security Warning',
      'Never share your seed phrase. Anyone with this phrase can fully control your wallet and funds. Make sure nobody can see your screen before continuing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'I Understand', style: 'destructive', onPress: () => setSeedVisible(true) },
      ]
    );
  };

  const createNewWallet = () => {
    Alert.alert(
      'Create New Wallet',
      'This will replace the currently saved wallet on this device. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace Wallet', style: 'destructive', onPress: () => { generateWallet(); } },
      ]
    );
  };

  const showImport = () => {
    setImportMode(true);
    setSeedVisible(false);
    setReceiveMode(false);
    setSendMode(false);
  };

  const cancelImport = () => {
    setImportMode(false);
    setImportText('');
  };

  const openReceive = () => {
    setReceiveMode(true);
    setImportMode(false);
    setSendMode(false);
  };

  const closeReceive = () => {
    setReceiveMode(false);
  };

  const openSend = () => {
    setSendMode(true);
    setImportMode(false);
    setReceiveMode(false);
  };

  const closeSend = () => {
    setSendMode(false);
    setSendAddress('');
    setSendAmount('');
  };

  const submitRealSend = async (confirmed = false) => {
    try {
      if (!mnemonic) {
        Alert.alert('Error', 'Missing wallet mnemonic');
        return;
      }

      const dest = sendAddress.trim();
      const amount = sendAmount.trim();
      const available = Number(spendableBalance || '0');

      if (!dest) {
        Alert.alert('Invalid address', 'Please enter a destination address.');
        return;
      }

      if (!dest.startsWith('bn1')) {
        Alert.alert('Invalid address', 'This first real-send step supports bn1 addresses only.');
        return;
      }

      const amountNum = Number(amount.replace(',', '.'));
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        Alert.alert('Invalid amount', 'Please enter a valid amount.');
        return;
      }

      if (amountNum > available) {
        Alert.alert(
          'Insufficient spendable balance',
          `Spendable: ${spendableBalance} GOLDBRIX\nImmature: ${immatureBalance} GOLDBRIX`
        );
        return;
      }

    if (!confirmed) {
      Alert.alert(
        'Confirm Send',
        `Destination: ${dest}
Amount: ${amount} GOLDBRIX`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign & Broadcast', onPress: () => { void submitRealSend(true); } },
        ]
      );
      return;
    }
      setSending(true);

      let liveTxs = txs;

      if (address && !liveTxs.some((u) => u?.spendable === true && Number(u?.amount_sats || 0) > 0)) {
        console.log('SEND_PRECHECK_REFETCH');
        const refreshRes = await fetch(`${API_BASE}/api/address/${encodeURIComponent(address)}/txs`);
        if (refreshRes.ok) {
          const refreshData: AddressTxs = await refreshRes.json();
          liveTxs = Array.isArray(refreshData)
            ? refreshData
            : Array.isArray((refreshData as any).items)
            ? (refreshData as any).items
            : [];
          setTxs(liveTxs);
        }
      }

      console.log('SEND_TXS_LEN', liveTxs.length);
    console.log('SEND_SPENDABLE_LEN', liveTxs.filter((u) => u?.spendable === true && Number(u?.amount_sats || 0) > 0).length);
    console.log('SEND_FIRST_TX', JSON.stringify(liveTxs[0] || null));
    const signed = buildSignedRawTx({
        mnemonic,
        toAddress: dest,
        amountGbx: amount,
        utxos: liveTxs,
      });

    const feeGoldbrix = (Number(signed.feeSats) / 100000000).toFixed(8);

      const res = await fetch(`${API_BASE}/api/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawtx: signed.rawtx,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: BroadcastResponse = await res.json();

    Alert.alert(
      'Transaction Broadcasted',
      `Destination: ${dest}\nAmount: ${amount} GOLDBRIX\nFee: ${feeGoldbrix} GOLDBRIX\nTXID: ${data.txid}\n\nBroadcast successful. Balance and tx history update after confirmation.`
    );

    setSendMode(false);
      setSendAddress('');
      setSendAmount('');
      await refreshAll();
    } catch (err: any) {
      console.log('caught error');
      Alert.alert('Send Error', err?.message || 'Failed to sign and broadcast transaction');
    } finally {
      setSending(false);
    }
  };

  if (!loaded) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>Loading wallet...</Text>
      </View>
    );
  }

  if (importMode) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Import Wallet</Text>
        <Text style={styles.subtitle}>Paste your Goldbrix seed phrase below</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Seed Phrase</Text>
          <TextInput
            style={styles.input}
            multiline
            value={importText}
            onChangeText={setImportText}
            placeholder="Enter your 12 or 24 word seed phrase"
            placeholderTextColor="#6B7280"
          />

          <TouchableOpacity style={styles.button} onPress={importWallet}>
            <Text style={styles.buttonText}>Import Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={cancelImport}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (receiveMode && address) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Receive GOLDBRIX</Text>
        <Text style={styles.subtitle}>Share this address to receive Goldbrix</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Goldbrix Receive Address</Text>
          <Text style={styles.receiveAddress}>{address}</Text>

          <TouchableOpacity style={styles.button} onPress={() => copyText(address, 'Address')}>
            <Text style={styles.buttonText}>Copy Address</Text>
          </TouchableOpacity>

          <Text style={styles.tip}>Only send native GOLDBRIX to this address</Text>
        </View>

        <TouchableOpacity style={styles.secondaryActionButton} onPress={closeReceive}>
          <Text style={styles.secondaryActionButtonText}>Back to Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (sendMode && address) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Send GOLDBRIX</Text>
        <Text style={styles.subtitle}>Local signing + real broadcast</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.value}>{totalBalance} GOLDBRIX</Text>

          <Text style={[styles.label, { marginTop: 18 }]}>Spendable Balance</Text>
          <Text style={styles.value}>{spendableBalance} GOLDBRIX</Text>

          <Text style={[styles.label, { marginTop: 18 }]}>Immature Balance</Text>
          <Text style={styles.value}>{immatureBalance} GOLDBRIX</Text>

          <Text style={[styles.label, { marginTop: 18 }]}>Destination Address</Text>
          <TextInput
            style={styles.input}
            multiline
            value={sendAddress}
            onChangeText={setSendAddress}
            placeholder="Enter bn1 address"
            placeholderTextColor="#6B7280"
          />

          <Text style={[styles.label, { marginTop: 18 }]}>Amount (GOLDBRIX)</Text>
          <TextInput
            style={styles.inputSingle}
            value={sendAmount}
            onChangeText={setSendAmount}
            placeholder="0.00000000"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.button} onPress={submitRealSend} disabled={sending}>
            <Text style={styles.buttonText}>{sending ? 'Signing + Broadcasting...' : 'Sign + Broadcast'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={closeSend}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>GOLDBRIX One</Text>
      <Text style={styles.subtitle}>Native Goldbrix wallet</Text>

      {!address ? (
        <>
          <TouchableOpacity style={styles.button} onPress={generateWallet}>
            <Text style={styles.buttonText}>Generate Goldbrix Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={showImport}>
            <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Goldbrix Address</Text>
            <TouchableOpacity onPress={() => copyText(address, 'Address')}>
              <Text style={styles.value}>{address}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 18 }]}>Total Balance</Text>
            <Text style={styles.value}>
              {balanceLoading ? 'Loading...' : `${totalBalance} GOLDBRIX`}
            </Text>

            <Text style={[styles.label, { marginTop: 18 }]}>Spendable Balance</Text>
            <Text style={styles.value}>
              {balanceLoading ? 'Loading...' : `${spendableBalance} GOLDBRIX`}
            </Text>

            <Text style={[styles.label, { marginTop: 18 }]}>Immature Balance</Text>
            <Text style={styles.value}>
              {balanceLoading ? 'Loading...' : `${immatureBalance} GOLDBRIX`}
            </Text>

            <Text style={[styles.label, { marginTop: 18 }]}>Transactions</Text>
            <Text style={styles.value}>{txCount}</Text>

            <Text style={[styles.label, { marginTop: 18 }]}>Network</Text>
            <Text style={styles.value}>{network}</Text>

            {!seedVisible ? (
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButtonCompact} onPress={revealSeedPhrase}>
            <Text style={styles.actionButtonCompactText}>Reveal Seed Phrase</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonCompact} onPress={openReceive}>
            <Text style={styles.actionButtonCompactText}>Receive GOLDBRIX</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonCompact} onPress={openSend}>
            <Text style={styles.actionButtonCompactText}>Send GOLDBRIX</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonCompact} onPress={refreshAll}>
            <Text style={styles.actionButtonCompactText}>Refresh Balance</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionCardWide}>
          <Text style={styles.actionCardWideLabel}>Seed Phrase</Text>
          <TouchableOpacity onPress={() => copyText(mnemonic, 'Seed Phrase')}>
            <Text style={styles.value}>{mnemonic}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.tip}>Tap address to copy</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Transaction History</Text>

            {txLoading ? (
              <Text style={styles.value}>Loading...</Text>
            ) : txs.length === 0 ? (
              <Text style={styles.value}>No transactions yet</Text>
            ) : (
              txs.map((tx, index) => (
  <View key={`${tx.txid}-${tx.vout ?? index}`} style={styles.txItem}>
  <Text style={styles.txLabel}>TXID</Text>
  <Text style={styles.txValue}>{tx.txid}</Text>

  <Text style={[styles.txLabel, { marginTop: 10 }]}>Amount</Text>
  <Text style={styles.txValue}>{tx.amount_gbx ?? '0.00000000'} GOLDBRIX</Text>

  <Text style={[styles.txLabel, { marginTop: 10 }]}>Confirmations</Text>
  <Text style={styles.txValue}>{tx.confirmations ?? 0}</Text>

  <Text style={[styles.txLabel, { marginTop: 10 }]}>Height</Text>
  <Text style={styles.txValue}>{tx.height ?? '-'}</Text>

  <Text style={[styles.txLabel, { marginTop: 10 }]}>Spendable</Text>
  <Text style={styles.txValue}>{tx.spendable ? 'YES' : 'NO'}</Text>
</View>

              ))
            )}
          </View>

          
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 140,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#F5C542',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E5E7EB',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#F5C542',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#0B1220',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  card: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
  },
  label: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
  receiveAddress: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 34,
    fontWeight: '700',
  },
  input: {
    minHeight: 120,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 22,
  },
  inputSingle: {
    minHeight: 52,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 18,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#F5C542',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  secondaryButtonText: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
  },
  actionsGrid: {
    marginTop: 18,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButtonCompact: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#F5C542',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    minHeight: 74,
    justifyContent: 'center',
  },
  actionButtonCompactText: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionCardWide: {
    marginTop: 18,
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  actionCardWideLabel: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsRow: {
    marginTop: 18,
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  secondaryActionButton: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#F5C542',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '100%',
  },
  secondaryActionButtonText: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  replaceButton: {
    backgroundColor: '#7F1D1D',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  replaceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  tip: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 16,
  },
  txItem: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 16,
  },
  txLabel: {
    color: '#F5C542',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  txValue: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
  },
});

