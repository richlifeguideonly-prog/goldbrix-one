import { StyleSheet, Text, View, ScrollView } from 'react-native';

const languages = [
  'English',
  'Deutsch',
  'Română',
  'العربية',
  '中文',
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>App configuration and language selector.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Languages</Text>
        {languages.map((language) => (
          <Text key={language} style={styles.item}>• {language}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wallet Security</Text>
        <Text style={styles.text}>Local signing remains active. Seed phrase stays on device.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.text}>Language UI shell active. Real translations come next.</Text>
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
  item: { color: '#FFFFFF', fontSize: 17, lineHeight: 31 },
});
