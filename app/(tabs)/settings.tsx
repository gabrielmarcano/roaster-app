// import { StyleSheet, Image, Platform, View, ScrollView } from 'react-native';

// import { Text } from 'react-native-paper';

// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';

// export default function SettingsScreen() {
//   return (
//     <ScrollView>
//       <View
//         style={{
//           ...styles.content,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Text>This app includes example code to help you get started.</Text>
//         <Collapsible title="File-based routing">
//           <Text>
//             This app has two screens:{' '}
//             <Text variant="bodyMedium">app/(tabs)/index.tsx</Text> and{' '}
//             <Text variant="bodyMedium">app/(tabs)/explore.tsx</Text>
//           </Text>
//           <Text>
//             The layout file in{' '}
//             <Text variant="bodyMedium">app/(tabs)/_layout.tsx</Text> sets up the
//             tab navigator.
//           </Text>
//           <ExternalLink href="https://docs.expo.dev/router/introduction">
//             <Text variant="bodyMedium">Learn more</Text>
//           </ExternalLink>
//         </Collapsible>
//         <Collapsible title="Android, iOS, and web support">
//           <Text>
//             You can open this project on Android, iOS, and the web. To open the
//             web version, press <Text variant="bodyMedium">w</Text> in the
//             terminal running this project.
//           </Text>
//         </Collapsible>
//         <Collapsible title="Images">
//           <Text>
//             For static images, you can use the{' '}
//             <Text variant="bodyMedium">@2x</Text> and{' '}
//             <Text variant="bodyMedium">@3x</Text> suffixes to provide files for
//             different screen densities
//           </Text>
//           <Image
//             source={require('@/assets/images/react-logo.png')}
//             style={{ alignSelf: 'center' }}
//           />
//           <ExternalLink href="https://reactnative.dev/docs/images">
//             <Text variant="bodyMedium">Learn more</Text>
//           </ExternalLink>
//         </Collapsible>
//         <Collapsible title="Custom fonts">
//           <Text>
//             Open <Text variant="bodyMedium">app/_layout.tsx</Text> to see how to
//             load{' '}
//             <Text style={{ fontFamily: 'SpaceMono' }}>
//               custom fonts such as this one.
//             </Text>
//           </Text>
//           <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
//             <Text variant="bodyMedium">Learn more</Text>
//           </ExternalLink>
//         </Collapsible>
//         <Collapsible title="Light and dark mode components">
//           <Text>
//             This template has light and dark mode support. The{' '}
//             <Text variant="bodyMedium">useColorScheme()</Text> hook lets you
//             inspect what the user's current color scheme is, and so you can
//             adjust UI colors accordingly.
//           </Text>
//           <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
//             <Text variant="bodyMedium">Learn more</Text>
//           </ExternalLink>
//         </Collapsible>
//         <Collapsible title="Animations">
//           <Text>
//             This template includes an example of an animated component. The{' '}
//             <Text variant="bodyMedium">components/HelloWave.tsx</Text> component
//             uses the powerful{' '}
//             <Text variant="bodyMedium">react-native-reanimated</Text> library to
//             create a waving hand animation.
//           </Text>
//           {Platform.select({
//             ios: (
//               <Text>
//                 The <Text variant="bodyMedium">components/View.tsx</Text>{' '}
//                 component provides a parallax effect for the header image.
//               </Text>
//             ),
//           })}
//         </Collapsible>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     flex: 1,
//     padding: 32,
//     gap: 16,
//     overflow: 'hidden',
//     backgroundColor: '#353636',
//   },
// });

import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { useGetControllerConfig } from '@/api/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/contexts/ctx';

import { useState } from 'react';

export default function SettingsScreen() {
  const { session, signOut } = useSession();

  const [refreshing, setRefreshing] = useState(false);

  const {
    data: controllerConfigData,
    isLoading: isControllerConfigLoading,
    refetch,
  } = useGetControllerConfig();

  useRefreshOnFocus(refetch);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  if (isControllerConfigLoading)
    return (
      <View
        style={{
          ...styles.wrapper,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="displaySmall">Session: {session}</Text>

        <Text variant="displaySmall">
          configData: {JSON.stringify(controllerConfigData?.data)}
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            console.log(session);
            signOut();
          }}
        >
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#353636',
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
});
