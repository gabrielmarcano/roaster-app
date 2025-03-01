import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { Text } from 'react-native-paper';

import { useSession } from '@/contexts/sessionContext';
import TabBar from '@/components/ui/TabBar';
import TabsHeader from '@/components/ui/TabsHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import i18n from '@/i18n';

export default function TabLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>{i18n.t('Loading')}...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        // headerShown: false,
        tabBarHideOnKeyboard: true,
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('Tabs.Dashboard'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'gauge' : 'gauge-empty'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="controllers"
        options={{
          title: i18n.t('Tabs.Controllers'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={
                props.focused ? 'toggle-switch' : 'toggle-switch-off-outline'
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: i18n.t('Tabs.Timer'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'timer-settings' : 'timer-settings-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('Tabs.Settings'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'cog' : 'cog-outline'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
