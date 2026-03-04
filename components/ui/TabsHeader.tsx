import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, AppbarProps } from 'react-native-paper';
import { useSSE } from '@/contexts/sseContext';

interface TabsHeaderProps extends AppbarProps {
  navProps: BottomTabHeaderProps;
}

const TabsHeader = (props: TabsHeaderProps) => {
  const { isConnected } = useSSE();

  return (
    <Appbar.Header {...props}>
      {props.navProps.options.headerLeft
        ? props.navProps.options.headerLeft({})
        : undefined}

      <Appbar.Content
        title={getHeaderTitle(props.navProps.options, props.navProps.route.name)}
      />

      {props.navProps.options.headerRight
        ? props.navProps.options.headerRight({ canGoBack: true })
        : undefined}

      <View style={[styles.led, isConnected ? styles.ledOn : styles.ledOff]} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  led: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 16,
  },
  ledOn: {
    backgroundColor: '#4CAF50',
  },
  ledOff: {
    backgroundColor: '#F44336',
  },
});

export default TabsHeader;
