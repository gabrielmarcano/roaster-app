import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useSSE } from '@/contexts/sseContext';

import { useEffect, useState } from 'react';
import { useUpdateTimer } from '@/api/queries';
import CircularProgress from '@/components/CircularProgress';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TimerScreen() {
  const { eventSource, time } = useSSE();

  const [refreshing, setRefreshing] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const updateTimer = useUpdateTimer();

  const handleAddTime = () => {
    updateTimer.mutate({ action: 'add' });
  };
  const handleReduceTime = () => {
    updateTimer.mutate({ action: 'reduce' });
  };

  const onRefresh = () => {
    setRefreshing(true);
    eventSource?.close();
    eventSource?.open();
    setPercentage(0);
    setRefreshing(false);
  };

  useEffect(() => {
    if (time?.total_time) {
      setPercentage((time?.current_time * 100) / time?.total_time);
    }
  }, [time]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.timerContainer}>
          <CircularProgress
            progressPercent={percentage}
            bgColor="rgba(86, 172, 206, 0.2)"
            pgColor="rgba(86, 172, 206, 1)"
            textSize="45"
            textColor="lightgray"
            size={300}
            strokeWidth={40}
            text={new Date((time?.current_time ?? 0) * 1000)
              .toISOString()
              .slice(11, 19)}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                handleReduceTime();
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="rewind-60"
                size={30}
                color="rgb(234, 222, 244)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                handleAddTime();
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="fast-forward-60"
                size={30}
                color="rgb(234, 222, 244)"
              />
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
  },
  buttonsContainer: {
    width: 300,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: 120,
    backgroundColor: 'rgb(75, 67, 86)',
  },
});
