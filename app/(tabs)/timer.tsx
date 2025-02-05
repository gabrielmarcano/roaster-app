import { CustomEvents } from '@/api/types';
import { useSession } from '@/contexts/ctx';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, Button, Text } from 'react-native-paper';

import EventSource from 'react-native-sse';

export default function TimerScreen() {
  const { session } = useSession();
  const [message, setMessage] = useState('');
  const [sensors, setSensors] = useState('');
  const [time, setTime] = useState('');
  const [states, setStates] = useState('');
  const [controller, setController] = useState('');

  useEffect(() => {
    const eventSource = new EventSource<CustomEvents>(`http://192.168.1.90/events`);

    eventSource.addEventListener('open', (event) => {
      console.log('Open SSE connection.');
    });

    eventSource.addEventListener('message', (event) => {
      console.log('New message event:', event.data);
      if (event.data) {
        setMessage(event.data);
      }
    });

    eventSource.addEventListener('sensors', (event) => {
      console.log('New sensors event:', event.data);
      if (event.data) {
        setSensors(event.data);
      }

    });

    eventSource.addEventListener('time', (event) => {
      console.log('New time event:', event.data);
      if (event.data) {
        setTime(event.data);
      }
    });

    eventSource.addEventListener('states', (event) => {
      console.log('New states event:', event.data);
      if (event.data) {
        setStates(event.data);
      }
    });

    eventSource.addEventListener('controller', (event) => {
      console.log('New controller event:', event.data);
      if (event.data) {
        setController(event.data);
      }
    });

    eventSource.addEventListener('error', (event) => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    eventSource.addEventListener('close', (event) => {
      console.log('Close SSE connection.');
    });

    // Clean up the EventSource on component unmount
    return () => {
      eventSource.close();
    };
  }, [session]);

  if (!session)
    return (
      <View
        style={{
          ...styles.content,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );

  return (
    <View style={styles.content}>
      <Text variant="displaySmall">
        message event: {message}
      </Text>
      <Text variant="displaySmall">
        sensors event: {sensors}
      </Text>
      <Text variant="displaySmall">
        time event: {time}
      </Text>
      <Text variant="displaySmall">
        states event: {states}
      </Text>
      <Text variant="displaySmall">
        controller event: {controller}
      </Text>
      <Button
        mode="contained"
        onPress={() => {
          console.log('clicked');
        }}
      >
        Click
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
    backgroundColor: '#353636',
  },
});
