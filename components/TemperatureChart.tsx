import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart, yAxisSides } from 'react-native-gifted-charts';
import { IDataChart } from '@/api/types';

const TemperatureChart = (props: IDataChart) => {
  return (
    <View
      style={{
        paddingVertical: 60,
        paddingLeft: 20,
        backgroundColor: '#1C1C1C',
      }}
    >
      <LineChart
        overflowTop={1}
        areaChart
        data={props.data}
        width={330}
        hideDataPoints
        spacing={10}
        color="#00ff83"
        thickness={2}
        startFillColor="rgba(20,105,81,0.3)"
        endFillColor="rgba(20,85,81,0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={6}
        maxValue={400}
        yAxisColor="white"
        yAxisThickness={0}
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisSide={yAxisSides.RIGHT}
        xAxisColor="lightgray"
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
              <View
                style={{
                  height: 90,
                  width: 80,
                  justifyContent: 'center',
                  marginTop: -50,
                  marginLeft: -40,
                }}
              >
                <View
                  style={{
                    paddingVertical: 3,
                    borderRadius: 16,
                    backgroundColor: 'grey',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {items[0].value + '°C'}
                  </Text>
                </View>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

export default TemperatureChart;
