import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coming Soon</Text>
      <Text style={styles.subtitle}>Wallet · Swap · Mining monitor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#F5C542',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#E5E7EB',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
});
