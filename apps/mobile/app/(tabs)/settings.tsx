import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Lang, useI18n } from '../../lib/i18n';

const languages: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ro', label: 'Română' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
];

export default function SettingsScreen() {
  const { lang, setLang, t } = useI18n();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.language')}</Text>
        <View style={styles.langGrid}>
          {languages.map((item) => (
            <Pressable
              key={item.code}
              onPress={() => setLang(item.code)}
              style={[styles.lang, lang === item.code && styles.langActive]}
            >
              <Text style={[styles.langText, lang === item.code && styles.langTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.security')}</Text>
        <Text style={styles.item}>{t('settings.local')}</Text>
        <Text style={styles.item}>{t('settings.seed')}</Text>
        <Text style={styles.item}>{t('settings.cloud')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.status')}</Text>
        <Text style={styles.item}>Version: 1.0.15 navigation-i18n</Text>
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
