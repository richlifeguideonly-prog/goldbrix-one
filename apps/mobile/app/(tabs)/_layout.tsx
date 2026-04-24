import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <Text style={{ color, fontSize: 22, fontWeight: '900' }}>
      {label}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F5C542',
        tabBarInactiveTintColor: '#7F8796',
        tabBarStyle: {
          backgroundColor: '#06101F',
          height: 82,
          paddingTop: 7,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: '#22395D',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon label="◆" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <TabIcon label="₿" color={color} />,
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          title: 'Buy',
          tabBarIcon: ({ color }) => <TabIcon label="$" color={color} />,
        }}
      />
      <Tabs.Screen
        name="launchpad"
        options={{
          title: 'Launch',
          tabBarIcon: ({ color }) => <TabIcon label="★" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Mining',
          tabBarIcon: ({ color }) => <TabIcon label="⚒" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon label="⚙" color={color} />,
        }}
      />
    </Tabs>
  );
}
