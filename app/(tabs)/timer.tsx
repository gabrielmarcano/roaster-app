import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { useSSE } from '@/contexts/sseContext';

import { useEffect, useState } from 'react';
import { useUpdateTimer } from '@/api/queries';
import CircularProgress from '@/components/CircularProgress';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TimerScreen() {
  const { reconnect, time } = useSSE();
  const { width: screenWidth } = useWindowDimensions();

  const [refreshing, setRefreshing] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const updateTimer = useUpdateTimer();

  const circleSize = Math.min(screenWidth * 0.75, 300);
  const strokeWidth = Math.round(circleSize * 40 / 300);
  const textSize = Math.round(circleSize * 45 / 300);
  const buttonWidth = Math.round(circleSize * 0.38);
  const buttonHeight = Math.round(circleSize * 0.17);
  const iconSize = Math.round(circleSize * 30 / 300);

  const handleAddTime = () => {
    updateTimer.mutate({ action: 'add' });
  };
  const handleReduceTime = () => {
    updateTimer.mutate({ action: 'reduce' });
  };

  const onRefresh = () => {
    setRefreshing(true);
    reconnect();
    setTimeout(() => setRefreshing(false), 0);
  };

  useEffect(() => {
    if (time?.total_time) {
      setPercentage((time.current_time * 100) / time.total_time);
    } else {
      setPercentage(0);
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
            textSize={textSize}
            textColor="lightgray"
            size={circleSize}
            strokeWidth={strokeWidth}
            text={new Date((time?.current_time ?? 0) * 1000)
              .toISOString()
              .slice(11, 19)}
          />
          <View style={[styles.buttonsContainer, { width: circleSize }]}>
            <TouchableOpacity
              style={[styles.icon, { width: buttonWidth, height: buttonHeight }]}
              onPress={handleReduceTime}
              activeOpacity={0.7}
              disabled={updateTimer.isPending}
            >
              <MaterialCommunityIcons
                name="rewind-60"
                size={iconSize}
                color="rgb(234, 222, 244)"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.icon, { width: buttonWidth, height: buttonHeight }]}
              onPress={handleAddTime}
              activeOpacity={0.7}
              disabled={updateTimer.isPending}
            >
              <MaterialCommunityIcons
                name="fast-forward-60"
                size={iconSize}
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
    flexGrow: 1,
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
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(75, 67, 86)',
  },
});
