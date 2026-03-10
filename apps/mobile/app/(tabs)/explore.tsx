import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE = 'https://89-167-36-203.sslip.io/miner-api';

type MiningStatus = {
  ok: boolean;
  service: string;
  backend: string;
  miner_service: string;
  mining_active: boolean;
  network: string;
  best_block_height: number;
  best_block_hash: string;
  peer_count: number;
  synced: boolean;
  difficulty: number;
  networkhashps: number;
  pooledtx: number;
  currentblocktx: number;
  currentblockweight: number;
  mempool_size: number;
  mempool_bytes: number;
  payout_address: string;
  payout_total_gbx: string;
  payout_spendable_gbx: string;
  payout_immature_gbx: string;
  payout_tx_count: number;
  payout_utxo_count: number;
  payout_last_txid: string | null;
  payout_error: string | null;
  updated_at: number;
};

export default function ExploreScreen() {
  const [status, setStatus] = useState<MiningStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [draftPayoutAddress, setDraftPayoutAddress] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/status`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: MiningStatus = await res.json();
      setStatus(data);
      setDraftPayoutAddress(data.payout_address || '');
    } catch (err) {
      console.error(err);
      Alert.alert('API Error', 'Failed to fetch Goldbrix mining status');
    } finally {
      setLoading(false);
    }
  };

  const savePayoutAddress = async () => {
    try {
      const clean = draftPayoutAddress.trim();

      if (!clean) {
        Alert.alert('Invalid address', 'Please enter a payout address.');
        return;
      }

      if (!/^(bn1|C|S)/.test(clean)) {
        Alert.alert('Invalid address', 'Address must start with bn1, C, or S.');
        return;
      }

      setActionLoading(true);

      const res = await fetch(`${API_BASE}/api/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: clean }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchStatus();
      Alert.alert('Saved', 'Payout address saved successfully');
    } catch (err) {
      console.error(err);
      Alert.alert('API Error', 'Failed to save payout address');
    } finally {
      setActionLoading(false);
    }
  };

  const startMining = async () => {
    try {
      setActionLoading(true);

      const res = await fetch(`${API_BASE}/api/miner/start`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchStatus();
      Alert.alert('Mining Started', 'Goldbrix mining started');
    } catch (err) {
      console.error(err);
      Alert.alert('API Error', 'Failed to start mining');
    } finally {
      setActionLoading(false);
    }
  };

  const stopMining = async () => {
    try {
      setActionLoading(true);

      const res = await fetch(`${API_BASE}/api/miner/stop`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchStatus();
      Alert.alert('Mining Stopped', 'Goldbrix mining stopped');
    } catch (err) {
      console.error(err);
      Alert.alert('API Error', 'Failed to stop mining');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Mining</Text>
        <Text style={styles.subtitle}>Goldbrix Wallet + Miner</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Node Status</Text>

          <Text style={styles.label}>Network</Text>
          <Text style={styles.value}>{status?.network ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Mining Active</Text>
          <Text style={styles.value}>
            {loading ? 'Loading...' : status ? (status.mining_active ? 'Yes' : 'No') : '-'}
          </Text>

          <Text style={[styles.label, styles.mt]}>Miner Service</Text>
          <Text style={styles.value}>{status?.miner_service ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Synced</Text>
          <Text style={styles.value}>
            {loading ? 'Loading...' : status ? (status.synced ? 'Yes' : 'No') : '-'}
          </Text>

          <Text style={[styles.label, styles.mt]}>Best Block Height</Text>
          <Text style={styles.value}>{status?.best_block_height ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Peer Count</Text>
          <Text style={styles.value}>{status?.peer_count ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Best Block Hash</Text>
          <Text style={styles.value}>{status?.best_block_hash ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Updated At</Text>
          <Text style={styles.value}>{status?.updated_at ?? '-'}</Text>

          <TouchableOpacity style={styles.button} onPress={fetchStatus}>
            <Text style={styles.buttonText}>Refresh Mining Status</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payout Balance</Text>

          <Text style={styles.label}>Payout Address</Text>
          <Text style={styles.value}>{status?.payout_address || 'No payout address set yet'}</Text>

          <Text style={[styles.label, styles.mt]}>Total Balance</Text>
          <Text style={styles.value}>{status?.payout_total_gbx ?? '0.00000000'} GBX</Text>

          <Text style={[styles.label, styles.mt]}>Spendable Balance</Text>
          <Text style={styles.value}>{status?.payout_spendable_gbx ?? '0.00000000'} GBX</Text>

          <Text style={[styles.label, styles.mt]}>Immature Balance</Text>
          <Text style={styles.value}>{status?.payout_immature_gbx ?? '0.00000000'} GBX</Text>

          <Text style={[styles.label, styles.mt]}>Transactions</Text>
          <Text style={styles.value}>{status?.payout_tx_count ?? 0}</Text>

          <Text style={[styles.label, styles.mt]}>UTXO Count</Text>
          <Text style={styles.value}>{status?.payout_utxo_count ?? 0}</Text>

          {status?.payout_last_txid ? (
            <>
              <Text style={[styles.label, styles.mt]}>Last TXID</Text>
              <Text style={styles.value}>{status.payout_last_txid}</Text>
            </>
          ) : null}

          {status?.payout_error ? (
            <>
              <Text style={[styles.label, styles.mt]}>Payout Error</Text>
              <Text style={styles.value}>{status.payout_error}</Text>
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payout Address</Text>

          <TextInput
            style={styles.input}
            multiline
            value={draftPayoutAddress}
            onChangeText={setDraftPayoutAddress}
            placeholder="Enter bn1 / C / S address"
            placeholderTextColor="#6B7280"
          />

          <TouchableOpacity style={styles.button} onPress={savePayoutAddress} disabled={actionLoading}>
            <Text style={styles.buttonText}>
              {actionLoading ? 'Please wait...' : 'Save Payout Address'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mining Control</Text>

          <TouchableOpacity style={styles.button} onPress={startMining} disabled={actionLoading}>
            <Text style={styles.buttonText}>
              {actionLoading ? 'Please wait...' : 'Start Mining'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={stopMining} disabled={actionLoading}>
            <Text style={styles.secondaryButtonText}>
              {actionLoading ? 'Please wait...' : 'Stop Mining'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mining Stats</Text>

          <Text style={styles.label}>Difficulty</Text>
          <Text style={styles.value}>{status?.difficulty ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Network Hashrate</Text>
          <Text style={styles.value}>{status?.networkhashps ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Pooled TX</Text>
          <Text style={styles.value}>{status?.pooledtx ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Current Block TX</Text>
          <Text style={styles.value}>{status?.currentblocktx ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Current Block Weight</Text>
          <Text style={styles.value}>{status?.currentblockweight ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Mempool Size</Text>
          <Text style={styles.value}>{status?.mempool_size ?? '-'}</Text>

          <Text style={[styles.label, styles.mt]}>Mempool Bytes</Text>
          <Text style={styles.value}>{status?.mempool_bytes ?? '-'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 120,
    alignItems: 'center',
  },
  title: {
    color: '#F5C542',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#E5E7EB',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  sectionTitle: {
    color: '#F5C542',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
  mt: {
    marginTop: 18,
  },
  button: {
    marginTop: 22,
    backgroundColor: '#1F2937',
    borderColor: '#F5C542',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: '#0F172A',
    borderColor: '#F5C542',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#F5C542',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    minHeight: 110,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 22,
  },
});
