import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useSession } from '@/contexts/ctx';
import TabBar from '@/components/ui/TabBar';
import TabsHeader from '@/components/ui/TabsHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
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
        tabBarHideOnKeyboard: true,
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
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
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'test-tube' : 'test-tube-empty'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
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
