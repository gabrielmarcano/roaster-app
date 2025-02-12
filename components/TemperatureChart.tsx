import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart, yAxisSides } from 'react-native-gifted-charts';
import { IDataChart } from '@/api/types';
import i18n from '@/i18n';

export default function TemperatureChart(props: IDataChart) {
  return (
    <View style={styles.graphContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {i18n.t('Dashboard.Temperature')}
        </Text>
        <View style={styles.currentTemperatureContainer}>
          <View style={styles.currentTemperatureBox}>
            <Text
              style={styles.currentTemperatureText}
            >{`${props.data.at(-1)?.value ?? '-'}°C`}</Text>
          </View>
        </View>
      </View>
      <LineChart
        areaChart
        disableScroll
        scrollAnimation={false}
        data={props.data}
        width={330}
        hideDataPoints
        spacing={21}
        color="rgba(0, 255, 131, 1)"
        thickness={2}
        startFillColor="rgba(20,105,81,0.3)"
        endFillColor="rgba(20,85,81,0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={5}
        maxValue={200}
        rulesColor="gray"
        yAxisColor="white"
        yAxisThickness={0}
        yAxisTextStyle={{ color: 'gray', marginRight: -10 }}
        yAxisLabelSuffix="°C"
        yAxisSide={yAxisSides.RIGHT}
        xAxisColor="lightgray"
        overflowTop={1}
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripWidth: 0,
          pointerColor: 'lightgray',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items: typeof props.data) => {
            return (
              <View style={styles.pointerContainer}>
                <View style={styles.pointerBox}>
                  <Text style={styles.currentTemperatureText}>
                    {items[0].value + '°C'}
                  </Text>
                  <Text style={styles.currentTemperatureText}>
                    {items[0].timestamp.split(' ')[0]}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  graphContainer: {
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    marginBottom: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
  },
  currentTemperatureContainer: {
    width: 80,
    justifyContent: 'center',
    marginRight: 15,
  },
  currentTemperatureBox: {
    paddingVertical: 3,
    borderRadius: 16,
    backgroundColor: 'rgb(75, 67, 86)',
  },
  currentTemperatureText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(234, 222, 244)',
  },
  pointerContainer: {
    height: 90,
    width: 80,
    justifyContent: 'center',
    marginTop: -50,
    marginLeft: -40,
  },
  pointerBox: {
    paddingVertical: 3,
    borderRadius: 16,
    backgroundColor: 'rgb(75, 67, 86)',
  },
});
