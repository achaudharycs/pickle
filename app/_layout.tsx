import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PreferencesProvider } from '../context/PreferencesContext';

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="restaurant/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#4CAF50',
            presentation: 'card',
          }}
        />
      </Stack>
    </PreferencesProvider>
  );
}
