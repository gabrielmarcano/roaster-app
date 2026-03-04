import { IDataChart, ISensor } from '@/api/types';
import HumidityChart from '@/components/HumidityChart';
import TemperatureChart from '@/components/TemperatureChart';
import { useSSE } from '@/contexts/sseContext';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

export default function HomeScreen() {
  const { reconnect, sensors } = useSSE();
  const { width: screenWidth } = useWindowDimensions();

  const [refreshing, setRefreshing] = useState(false);

  const [temperatureData, setTemperatureData] = useState<
    IDataChart['data'] | []
  >([]);
  const [humidityData, setHumidityData] = useState<IDataChart['data'] | []>([]);

  const handleTemperatureData = (data: ISensor) => {
    setTemperatureData((prev) => {
      const next = [...prev, { value: data.temperature, timestamp: new Date().toTimeString() }];
      return next.length > 17 ? next.slice(-17) : next;
    });
  };

  const handleHumidityData = (data: ISensor) => {
    setHumidityData((prev) => {
      const next = [...prev, { value: data.humidity, timestamp: new Date().toTimeString() }];
      return next.length > 8 ? next.slice(-8) : next;
    });
  };

  useEffect(() => {
    if (sensors) {
      handleTemperatureData(sensors);
      handleHumidityData(sensors);
    }
  }, [sensors]);

  const onRefresh = () => {
    setRefreshing(true);
    reconnect();
    setTimeout(() => setRefreshing(false), 0);
  };

  const chartContainerWidth = screenWidth - 2 * 16;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TemperatureChart data={temperatureData} containerWidth={chartContainerWidth} />
        <HumidityChart data={humidityData} containerWidth={chartContainerWidth} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(53, 54, 54, 1)',
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 16,
    gap: 16,
  },
});
