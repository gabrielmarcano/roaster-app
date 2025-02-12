import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { useSession } from '@/contexts/sessionContext';

import i18n from '@/i18n';
import { Colors } from '@/constants/Colors';

export default function SignIn() {
  const [ip, setIp] = useState<string>('');
  const { signIn } = useSession();

  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const checkIP = (ip: string) => {
    const regex =
      /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    return regex.test(ip);
  };

  return (
    <View style={[styles.wrapper, styles.background]}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text variant="titleLarge">{i18n.t('SignIn.EnterYourIP')}</Text>
          <View>
            {/* TODO: Maybe add masked text input */}
            <TextInput
              mode="outlined"
              value={ip}
              placeholder={i18n.t('SignIn.Example')}
              onChangeText={(text) => setIp(text)}
              keyboardType="phone-pad"
            />
          </View>
          <Button
            mode="contained"
            onPress={() => {
              if (!checkIP(ip)) {
                onToggleSnackBar();
                return;
              }

              signIn(ip);
              // Navigate after signing in. You may want to tweak this to ensure sign-in is
              // successful before navigating.

              // if (!client.defaults.baseURL?.includes('http')) return

              router.replace('/(tabs)');
            }}
          >
            {i18n.t('SignIn.Start')}
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        duration={4000}
        onDismiss={onDismissSnackBar}
        style={styles.snackbar}
      >
        <Text variant="bodyLarge">{i18n.t('SignIn.InvalidIP')}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.dark.background,
  },
  snackbar: {
    margin: 32,
    color: 'white',

    backgroundColor: Colors.dark.onError,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
  },
  cardContainer: {
    width: '100%',
    padding: 32,
    backgroundColor: 'rgba(53, 54, 54, 1)',
    borderRadius: 16,
    gap: 24,
  },
});
