import { CustomEvents } from '@/api/types';
import { useSession } from '@/contexts/ctx';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, Text } from 'react-native-paper';

import EventSource from 'react-native-sse';

export default function HomeScreen() {
  const { session } = useSession();

  const [refreshing, setRefreshing] = useState(false);

  const [eventSource, setEventSource] =
    useState<EventSource<CustomEvents> | null>(null);
  const [sensors, setSensors] = useState('');
  const [time, setTime] = useState('');
  const [states, setStates] = useState('');
  const [controller, setController] = useState('');

  useEffect(() => {
    const es = new EventSource<CustomEvents>(`http://${session}/events`);

    setEventSource(es);

    es.addEventListener('open', (event) => {
      console.log('Open SSE connection.');
    });

    es.addEventListener('sensors', (event) => {
      console.log('New sensors event:', event.data);
      if (event.data) {
        setSensors(event.data);
      }
    });

    es.addEventListener('time', (event) => {
      console.log('New time event:', event.data);
      if (event.data) {
        setTime(event.data);
      }
    });

    es.addEventListener('states', (event) => {
      console.log('New states event:', event.data);
      if (event.data) {
        setStates(event.data);
      }
    });

    es.addEventListener('controller', (event) => {
      console.log('New controller event:', event.data);
      if (event.data) {
        setController(event.data);
      }
    });

    es.addEventListener('error', (event) => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    es.addEventListener('close', (event) => {
      console.log('Close SSE connection.');
    });

    // Clean up the EventSource on component unmount
    return () => {
      es.close();
      setEventSource(null);
    };
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    eventSource?.close();
    eventSource?.open();
    setRefreshing(false);
  };

  if (!session)
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
        <Text variant="displaySmall">sensors event: {sensors}</Text>
        <Text variant="displaySmall">time event: {time}</Text>
        <Text variant="displaySmall">states event: {states}</Text>
        <Text variant="displaySmall">controller event: {controller}</Text>
        <Button
          mode="contained"
          onPress={() => {
            eventSource?.close();
          }}
        >
          Close event source
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            console.log('clicked');
          }}
        >
          Click
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
