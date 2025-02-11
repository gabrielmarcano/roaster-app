import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Text } from 'react-native-paper';

import { useSSE } from '@/contexts/sseContext';

import { useEffect, useState } from 'react';
import { useUpdateTimer } from '@/api/queries';
import i18n from '@/i18n';
import CircularProgress from '@/components/CircularProgress';

export default function TimerScreen() {
  const { eventSource, time } = useSSE();

  const [refreshing, setRefreshing] = useState(false);
  const [percentage, setPercentage] = useState(100);

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
        <Text variant="displaySmall">current time: {time?.current_time}</Text>
        <Text variant="displaySmall">total time: {time?.total_time}</Text>

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
            <Button
              mode="contained-tonal"
              onPress={() => {
                handleReduceTime();
              }}
            >
              {i18n.t('Timer.Buttons.ReduceTime')}
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => {
                handleAddTime();
              }}
            >
              {i18n.t('Timer.Buttons.AddTime')}
            </Button>
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
});
