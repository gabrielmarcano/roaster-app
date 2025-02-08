import { CustomEvents, IDataChart, ISensor } from '@/api/types';
import HumidityChart from '@/components/HumidityChart';
import TemperatureChart from '@/components/TemperatureChart';
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

  const [temperatureData, setTemperatureData] = useState<
    IDataChart['data'] | []
  >([]);
  const [humidityData, setHumidityData] = useState<IDataChart['data'] | []>([]);

  const handleTemperatureData = (data: ISensor) => {
    setTemperatureData((prev) => [
      ...prev,
      {
        value: data.temperature,
        timestamp: new Date().toISOString(),
      },
    ]);

    setTemperatureData((prev) => (prev.length > 17 ? prev.slice(-17) : prev));
  };

  const handleHumidityData = (data: ISensor) => {
    setHumidityData((prev) => [
      ...prev,
      {
        value: data.humidity,
        timestamp: new Date().toISOString(),
      },
    ]);

    setHumidityData((prev) => (prev.length > 8 ? prev.slice(-8) : prev));
  };

  useEffect(() => {
    const es = new EventSource<CustomEvents>(`http://${session}/events`);

    setEventSource(es);

    es.addEventListener('open', (event) => {
      console.log('Open SSE connection.');
    });

    es.addEventListener('sensors', (event) => {
      if (event.data) {
        const data: ISensor = JSON.parse(event.data);
        handleTemperatureData(data);
        handleHumidityData(data);
        setSensors(event.data);
      }
    });

    es.addEventListener('time', (event) => {
      if (event.data) {
        setTime(event.data);
      }
    });

    es.addEventListener('states', (event) => {
      if (event.data) {
        setStates(event.data);
      }
    });

    es.addEventListener('controller', (event) => {
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
        <TemperatureChart data={temperatureData} />
        <HumidityChart data={humidityData} />

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
