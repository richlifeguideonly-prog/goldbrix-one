import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const languages = ['English', 'Deutsch', 'Română', 'العربية', '中文'];

export default function SettingsScreen() {
  const [language, setLanguage] = useState('English');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Security, language and app configuration</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language</Text>
        <View style={styles.langGrid}>
          {languages.map((l) => (
            <Pressable
              key={l}
              onPress={() => setLanguage(l)}
              style={[styles.lang, language === l && styles.langActive]}
            >
              <Text style={[styles.langText, language === l && styles.langTextActive]}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wallet Security</Text>
        <Text style={styles.item}>Local signing stays active</Text>
        <Text style={styles.item}>Seed phrase remains on device</Text>
        <Text style={styles.item}>No cloud seed storage</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Status</Text>
        <Text style={styles.item}>Version: 1.0.14 UI v2 target</Text>
        <Text style={styles.item}>Network: goldbrix-mainnet</Text>
        <Text style={styles.item}>API: explorer-api / miner-api</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#06101F' },
  content: { paddingHorizontal: 22, paddingTop: 54, paddingBottom: 120 },
  title: { color: '#F5C542', fontSize: 38, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#B8C0D0', fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: '#0B1B33', borderRadius: 26, padding: 20, marginBottom: 18, borderColor: '#1D355A', borderWidth: 1 },
  cardTitle: { color: '#F5C542', fontSize: 21, fontWeight: '900', marginBottom: 14 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  lang: { borderColor: '#F5C542', borderWidth: 1, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14 },
  langActive: { backgroundColor: '#F5C542' },
  langText: { color: '#F5C542', fontWeight: '900' },
  langTextActive: { color: '#06101F' },
  item: { color: '#FFFFFF', fontSize: 15, lineHeight: 29 },
});
