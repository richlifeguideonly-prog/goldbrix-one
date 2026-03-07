import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GOLDBRIX One</Text>
      <Text style={styles.subtitle}>Private mobile wallet + swap UI</Text>
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
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#E5E7EB',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
});
