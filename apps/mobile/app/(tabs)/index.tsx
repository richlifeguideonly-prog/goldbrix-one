import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '../../lib/i18n';

const gold = '#F5C542';
const bg = '#06101F';
const card = '#0B1B33';
const card2 = '#102642';
const white = '#FFFFFF';
const muted = '#B8C0D0';
const green = '#34D399';



function LiveAnnouncementBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.bannerTop}>
        <Text style={styles.bannerBadge}>LIVE UPDATE</Text>
        <Text style={styles.bannerTime}>Public message</Text>
      </View>
      <Text style={styles.bannerTitle}>{t('home.banner.title')}</Text>
      <Text style={styles.bannerText}>
        {t('home.banner.text')}
      </Text>
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function Action({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{subtitle}</Text>
    </Pressable>
  );
}

export default function HomeDashboard() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>GOLDBRIX One</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

      <LiveAnnouncementBanner />

      <Card>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.cardTitle}>{t('home.control')}</Text>
            <Text style={styles.muted}>{t('home.ui')}</Text>
          </View>
          <View style={styles.livePill}>
            <Text style={styles.liveDot}>●</Text>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Stat label="Network" value="goldbrix-mainnet" sub="native chain" />
          <Stat label="Wallet" value="Local signing" sub="seed stays on device" />
          <Stat label="Mining" value="Pool ready" sub="payout address supported" />
          <Stat label="Launchpad" value="Next module" sub="create coins with GBX" />
        </View>
      </Card>

      <Text style={styles.section}>{t('home.quick')}</Text>
      <View style={styles.actionGrid}>
        <Action title={t('home.wallet')} subtitle={t('home.wallet.sub')} onPress={() => router.push('/wallet' as any)} />
        <Action title={t('home.buy')} subtitle={t('home.buy.sub')} onPress={() => router.push('/buy' as any)} />
        <Action title={t('home.launch')} subtitle={t('home.launch.sub')} onPress={() => router.push('/launchpad' as any)} />
        <Action title={t('home.mining')} subtitle={t('home.mining.sub')} onPress={() => router.push('/explore' as any)} />
      </View>

      <Card>
        <Text style={styles.cardTitle}>Revenue Engine</Text>
        <Text style={styles.text}>
          The app is now structured around cashflow modules: GBX wallet, USDC buy router,
          Launchpad fees, coin creation fees, mining pool visibility and future trading flows.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Build Roadmap</Text>
        <Text style={styles.item}>1. v1.0.14 Product UI v2</Text>
        <Text style={styles.item}>2. v1.0.15 Buy GBX order backend</Text>
        <Text style={styles.item}>3. v1.0.16 Solana USDC watcher</Text>
        <Text style={styles.item}>4. v1.0.17 GBX treasury payout</Text>
        <Text style={styles.item}>5. v1.0.18 Launchpad create coin</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: bg },
  content: { paddingHorizontal: 22, paddingTop: 54, paddingBottom: 120 },
  brand: { color: gold, fontSize: 38, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: muted, fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  section: { color: gold, fontSize: 22, fontWeight: '900', marginTop: 20, marginBottom: 12 },
  card: {
    backgroundColor: card,
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1D355A',
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  cardTitle: { color: gold, fontSize: 21, fontWeight: '900', marginBottom: 8 },
  muted: { color: muted, fontSize: 14 },
  text: { color: white, fontSize: 15, lineHeight: 24 },
  item: { color: white, fontSize: 15, lineHeight: 28 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D2A25',
    borderColor: '#1E7F5C',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
  },
  liveDot: { color: green, fontSize: 12, marginRight: 5 },
  liveText: { color: green, fontSize: 12, fontWeight: '900' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  statBox: {
    width: '48%',
    backgroundColor: card2,
    borderRadius: 18,
    padding: 14,
    borderColor: '#213B63',
    borderWidth: 1,
  },
  statLabel: { color: gold, fontSize: 13, fontWeight: '800', marginBottom: 5 },
  statValue: { color: white, fontSize: 16, fontWeight: '800' },
  statSub: { color: muted, fontSize: 12, marginTop: 4 },
  banner: {
    backgroundColor: '#1B263B',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5C542',
  },
  bannerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bannerBadge: {
    color: '#06101F',
    backgroundColor: '#F5C542',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    fontSize: 11,
    fontWeight: '900',
  },
  bannerTime: { color: '#B8C0D0', fontSize: 12, fontWeight: '700' },
  bannerTitle: { color: '#F5C542', fontSize: 20, fontWeight: '900', marginBottom: 8 },
  bannerText: { color: '#FFFFFF', fontSize: 15, lineHeight: 23 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  action: {
    width: '48%',
    backgroundColor: '#15243D',
    borderRadius: 22,
    padding: 18,
    minHeight: 105,
    borderColor: gold,
    borderWidth: 1,
  },
  actionTitle: { color: gold, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  actionSub: { color: white, fontSize: 14, lineHeight: 20 },
});
