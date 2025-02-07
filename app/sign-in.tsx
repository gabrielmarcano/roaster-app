import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { TextInput, Button, HelperText } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/contexts/ctx';

import i18n from '@/translations';

export default function SignIn() {
  const [ip, setIp] = useState<string>('');
  const { signIn } = useSession();

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ThemedView style={styles.textInputContainer}>
        <TextInput value={ip} onChangeText={(text) => setIp(text)} />
        <HelperText type="info">e.g. 192.168.1.10</HelperText>
      </ThemedView>
      <ThemedView>
        <Button
          mode="contained"
          onPress={() => {
            if (ip.length === 0) return;

            signIn(ip);
            // Navigate after signing in. You may want to tweak this to ensure sign-in is
            // successful before navigating.

            // if (!client.defaults.baseURL?.includes('http')) return

            router.replace('/(tabs)');
          }}
        >
          {i18n.t('Start')}
        </Button>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    width: '60%',
    marginBottom: 30,
  },
});
