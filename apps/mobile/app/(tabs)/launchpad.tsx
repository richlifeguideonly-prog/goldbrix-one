import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useI18n } from '../../lib/i18n';

export default function LaunchpadScreen() {
  const { t } = useI18n();
  const [name, setName] = useState('Gold Meme');
  const [ticker, setTicker] = useState('GMEME');
  const [supply, setSupply] = useState('1000000000');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('launch.title')}</Text>
      <Text style={styles.subtitle}>{t('launch.subtitle')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Coin</Text>

        <Text style={styles.label}>{t('launch.name')}</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#7B8495" />

        <Text style={styles.label}>{t('launch.ticker')}</Text>
        <TextInput value={ticker} onChangeText={setTicker} style={styles.input} autoCapitalize="characters" placeholderTextColor="#7B8495" />

        <Text style={styles.label}>{t('launch.supply')}</Text>
        <TextInput value={supply} onChangeText={setSupply} style={styles.input} keyboardType="number-pad" placeholderTextColor="#7B8495" />

        <View style={styles.logoBox}>
          <Text style={styles.logoText}>Upload logo placeholder</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Launch Economics</Text>
        <Text style={styles.item}>Creation fee: paid in GBX</Text>
        <Text style={styles.item}>Creator can buy first</Text>
        <Text style={styles.item}>Coin page + chart planned</Text>
        <Text style={styles.item}>Buy/Sell with GBX planned</Text>
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>{name}</Text>
        <Text style={styles.previewTicker}>${ticker}</Text>
        <Text style={styles.previewSub}>Supply: {Number(supply || 0).toLocaleString('en-US')}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            'Coin Draft Created',
            `Name: ${name}\nTicker: ${ticker}\nSupply: ${supply}\n\nNext backend: create coin fee in GBX + launch transaction.`
          )
        }
      >
        <Text style={styles.buttonText}>{t('launch.create')}</Text>
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
  cardTitle: { color: '#F5C542', fontSize: 21, fontWeight: '900', marginBottom: 14 },
  label: { color: '#F5C542', fontWeight: '800', marginBottom: 8, marginTop: 12 },
  input: { color: '#FFFFFF', borderColor: '#263E66', borderWidth: 1, borderRadius: 18, padding: 16, fontSize: 17, backgroundColor: '#102642' },
  logoBox: { borderColor: '#F5C542', borderWidth: 1, borderStyle: 'dashed', borderRadius: 22, padding: 26, alignItems: 'center', marginTop: 18 },
  logoText: { color: '#F5C542', fontWeight: '900' },
  item: { color: '#FFFFFF', fontSize: 15, lineHeight: 29 },
  preview: { backgroundColor: '#15243D', borderRadius: 26, padding: 22, marginBottom: 18, borderColor: '#F5C542', borderWidth: 1 },
  previewTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  previewTicker: { color: '#F5C542', fontSize: 20, fontWeight: '900', marginTop: 6 },
  previewSub: { color: '#B8C0D0', marginTop: 8 },
  button: { backgroundColor: '#F5C542', borderRadius: 22, padding: 18, alignItems: 'center' },
  buttonText: { color: '#06101F', fontSize: 18, fontWeight: '900' },
});
