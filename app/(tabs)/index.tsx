import { IDataChart, ISensor } from '@/api/types';
import HumidityChart from '@/components/HumidityChart';
import TemperatureChart from '@/components/TemperatureChart';
import { useSSE } from '@/contexts/sseContext';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { eventSource, sensors } = useSSE();

  const [refreshing, setRefreshing] = useState(false);

  const [temperatureData, setTemperatureData] = useState<
    IDataChart['data'] | []
  >([]);
  const [humidityData, setHumidityData] = useState<IDataChart['data'] | []>([]);

  const handleTemperatureData = (data: ISensor) => {
    setTemperatureData((prev) => [
      ...prev,
      {
        value: data.temperature,
        timestamp: new Date().toTimeString(),
      },
    ]);

    setTemperatureData((prev) => (prev.length > 17 ? prev.slice(-17) : prev));
  };

  const handleHumidityData = (data: ISensor) => {
    setHumidityData((prev) => [
      ...prev,
      {
        value: data.humidity,
        timestamp: new Date().toTimeString(),
      },
    ]);

    setHumidityData((prev) => (prev.length > 8 ? prev.slice(-8) : prev));
  };

  useEffect(() => {
    if (sensors) {
      handleTemperatureData(sensors);
      handleHumidityData(sensors);
    }
  }, [sensors]);

  const onRefresh = () => {
    setRefreshing(true);
    eventSource?.close();
    eventSource?.open();
    setRefreshing(false);
  };

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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 16,
    gap: 16,
  },
});
