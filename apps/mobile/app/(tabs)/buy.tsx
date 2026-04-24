import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const NETWORKS = ['Solana USDC', 'BNB USDC', 'Ethereum USDC'];
const RATE = 100;

export default function BuyGbxScreen() {
  const [network, setNetwork] = useState('Solana USDC');
  const [amount, setAmount] = useState('100');
  const gbx = useMemo(() => {
    const n = Number(amount.replace(',', '.'));
    if (!Number.isFinite(n) || n <= 0) return '0';
    return (n * RATE).toLocaleString('en-US');
  }, [amount]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Buy GBX</Text>
      <Text style={styles.subtitle}>USDC deposit watcher + GBX treasury payout</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Select USDC Network</Text>
        <View style={styles.row}>
          {NETWORKS.map((n) => (
            <Pressable
              key={n}
              onPress={() => setNetwork(n)}
              style={[styles.pill, network === n && styles.pillActive]}
            >
              <Text style={[styles.pillText, network === n && styles.pillTextActive]}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Amount</Text>
        <Text style={styles.label}>USDC Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="100"
          placeholderTextColor="#7B8495"
          style={styles.input}
        />
        <Text style={styles.estimate}>Estimated receive: {gbx} GBX</Text>
        <Text style={styles.small}>Reference UI rate: 1 USDC = {RATE} GBX</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Deposit Order</Text>
        <Text style={styles.text}>Backend endpoint planned:</Text>
        <Text style={styles.code}>POST /api/buy/order</Text>
        <Text style={styles.text}>The backend will create an order, assign a deposit address and watch the selected chain.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Treasury Payout</Text>
        <Text style={styles.item}>Status: UI shell ready</Text>
        <Text style={styles.item}>Watcher: next build</Text>
        <Text style={styles.item}>GBX payout: treasury worker next</Text>
        <Text style={styles.item}>Target chain: {network}</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Create Buy Order</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#06101F' },
  content: { paddingHorizontal: 22, paddingTop: 54, paddingBottom: 120 },
  title: { color: '#F5C542', fontSize: 38, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#B8C0D0', fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: '#0B1B33', borderRadius: 26, padding: 20, marginBottom: 18, borderColor: '#1D355A', borderWidth: 1 },
  cardTitle: { color: '#F5C542', fontSize: 20, fontWeight: '900', marginBottom: 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { borderColor: '#F5C542', borderWidth: 1, borderRadius: 99, paddingVertical: 10, paddingHorizontal: 14 },
  pillActive: { backgroundColor: '#F5C542' },
  pillText: { color: '#F5C542', fontWeight: '800' },
  pillTextActive: { color: '#06101F' },
  label: { color: '#F5C542', fontWeight: '800', marginBottom: 8 },
  input: { color: '#FFFFFF', borderColor: '#263E66', borderWidth: 1, borderRadius: 18, padding: 16, fontSize: 18, backgroundColor: '#102642' },
  estimate: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 16 },
  small: { color: '#B8C0D0', marginTop: 6 },
  text: { color: '#FFFFFF', fontSize: 15, lineHeight: 24 },
  code: { color: '#34D399', fontSize: 15, fontWeight: '900', marginVertical: 8 },
  item: { color: '#FFFFFF', fontSize: 15, lineHeight: 28 },
  button: { backgroundColor: '#F5C542', borderRadius: 22, padding: 18, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#06101F', fontSize: 18, fontWeight: '900' },
});
