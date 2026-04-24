import { StyleSheet, Text, View, ScrollView } from 'react-native';

const networks = [
  'Solana USDC',
  'BNB Chain USDC',
  'Ethereum USDC',
];

export default function BuyGoldbrixScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Buy GOLDBRIX</Text>
      <Text style={styles.subtitle}>USDC onboarding module for buying GOLDBRIX.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Supported USDC Routes</Text>
        {networks.map((network) => (
          <Text key={network} style={styles.item}>• {network}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Target Flow</Text>
        <Text style={styles.text}>1. User chooses USDC network.</Text>
        <Text style={styles.text}>2. App shows deposit address or checkout route.</Text>
        <Text style={styles.text}>3. Backend confirms USDC deposit.</Text>
        <Text style={styles.text}>4. User receives GOLDBRIX in app wallet.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.text}>UI shell active. Backend deposit logic comes later.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B1220' },
  content: { paddingHorizontal: 24, paddingTop: 70, paddingBottom: 140 },
  title: { color: '#F5C542', fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#E5E7EB', fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 24 },
  card: { backgroundColor: '#111827', borderRadius: 18, padding: 18, marginTop: 16 },
  cardTitle: { color: '#F5C542', fontSize: 20, fontWeight: '800', marginBottom: 10 },
  text: { color: '#FFFFFF', fontSize: 15, lineHeight: 25 },
  item: { color: '#FFFFFF', fontSize: 16, lineHeight: 28 },
});
