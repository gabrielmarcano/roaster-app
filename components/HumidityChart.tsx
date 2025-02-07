import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { IDataChart } from '@/api/types';

const HumidityChart = (props: IDataChart) => {
  return (
    <View
      style={{
        paddingVertical: 60,
        paddingLeft: 10,
        backgroundColor: '#1C1C1C',
      }}
    >
      <LineChart
        areaChart
        curved
        data={props.data}
        hideDataPoints
        width={330}
        spacing={48}
        color="#56acce"
        startFillColor="#56acce"
        endFillColor="#56acce"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={4}
        maxValue={100}
        yAxisColor="white"
        yAxisThickness={0}
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisLabelSuffix="%"
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
                    {items[0].value + '%'}
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

export default HumidityChart;
