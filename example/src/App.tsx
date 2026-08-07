import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from '@boiboif/react-native-toast';

const actions = [
  { label: 'Show toast', action: () => Toast.show('Hello from native toast') },
  { label: 'Success', action: () => Toast.success('Saved successfully') },
  { label: 'Warning', action: () => Toast.warning('Please check your input') },
  { label: 'Error', action: () => Toast.error('Something went wrong') },
] as const;

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>React Native Toast</Text>
        {actions.map(({ label, action }) => (
          <TouchableOpacity key={label} style={styles.button} onPress={action}>
            <Text style={styles.buttonLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.secondaryButton} onPress={Toast.hide}>
          <Text style={styles.secondaryLabel}>Hide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    marginBottom: 20,
    color: '#17181A',
    fontSize: 28,
    fontWeight: '700',
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#17181A',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#909399',
    borderRadius: 6,
  },
  secondaryLabel: {
    color: '#303133',
    fontSize: 16,
    fontWeight: '600',
  },
});
