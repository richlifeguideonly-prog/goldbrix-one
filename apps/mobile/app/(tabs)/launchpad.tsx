import { StyleSheet, Text, View, ScrollView } from 'react-native';

const roadmap = [
  'Create Coin',
  'Upload logo',
  'Set ticker and supply',
  'Pay launch fee in GOLDBRIX',
  'Creator can buy first',
  'Public launch page',
  'Bonding curve / pool integration',
];

export default function LaunchpadScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>GOLDBRIX Launchpad</Text>
      <Text style={styles.subtitle}>Create and launch tokens inside the Goldbrix ecosystem.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Coin</Text>
        <Text style={styles.text}>
          This module will allow users to create a new coin directly from the app, upload a logo,
          define ticker and supply, then pay the creation fee in GOLDBRIX.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Launch Flow</Text>
        {roadmap.map((item, index) => (
          <Text key={item} style={styles.item}>
            {index + 1}. {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.text}>Product shell active. Functional Create Coin form comes next.</Text>
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
  text: { color: '#FFFFFF', fontSize: 15, lineHeight: 23 },
  item: { color: '#FFFFFF', fontSize: 15, lineHeight: 26 },
});
