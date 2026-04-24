import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { I18nProvider, useI18n } from '../../lib/i18n';

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <Text style={{ color, fontSize: 21, fontWeight: '900' }}>
      {label}
    </Text>
  );
}

function TabsNavigator() {
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F5C542',
        tabBarInactiveTintColor: '#9AA3B2',
        tabBarStyle: {
          backgroundColor: '#06101F',
          height: 82,
          paddingTop: 7,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: '#23395D',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tab.home'), tabBarIcon: ({ color }) => <TabIcon label="◆" color={color} /> }} />
      <Tabs.Screen name="wallet" options={{ title: t('tab.wallet'), tabBarIcon: ({ color }) => <TabIcon label="₿" color={color} /> }} />
      <Tabs.Screen name="buy" options={{ title: t('tab.buy'), tabBarIcon: ({ color }) => <TabIcon label="$" color={color} /> }} />
      <Tabs.Screen name="launchpad" options={{ title: t('tab.launch'), tabBarIcon: ({ color }) => <TabIcon label="★" color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: t('tab.mining'), tabBarIcon: ({ color }) => <TabIcon label="⚒" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: t('tab.settings'), tabBarIcon: ({ color }) => <TabIcon label="⚙" color={color} /> }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <I18nProvider>
      <TabsNavigator />
    </I18nProvider>
  );
}
