import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TextInput, Button, HelperText } from 'react-native-paper';
import { useSession } from '@/contexts/sessionContext';

import i18n from '@/i18n';
import { Colors } from '@/constants/Colors';

export default function SignIn() {
  const [ip, setIp] = useState<string>('');
  const { signIn } = useSession();

  return (
    <View style={[styles.wrapper, styles.background]}>
      <View style={styles.textInputContainer}>
        <TextInput value={ip} onChangeText={(text) => setIp(text)} />
        <HelperText type="info">e.g. 192.168.1.10</HelperText>
      </View>
      <View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    width: '60%',
    marginBottom: 30,
  },
  background: {
    backgroundColor: Colors.dark.background,
  },
});
