import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart, yAxisSides } from 'react-native-gifted-charts';
import { IDataChart } from '@/api/types';
import i18n from '@/i18n';

const HumidityChart = (props: IDataChart) => {
  return (
    <View
      style={{
        paddingVertical: 20,
        paddingLeft: 20,
        backgroundColor: 'rgba(28, 28, 28, 0.7)',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: -10,
          marginBottom: 50,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 20,
          }}
        >
          {i18n.t('Dashboard.Humidity')}
        </Text>
        <View
          style={{
            width: 80,
            justifyContent: 'center',
            marginRight: 15,
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
              {`${props.data.at(-1)?.value ?? '-'}%`}
            </Text>
          </View>
        </View>
      </View>

      <LineChart
        areaChart
        curved
        disableScroll
        data={props.data}
        hideDataPoints
        width={330}
        spacing={48}
        color="rgba(86, 172, 206, 1)"
        startFillColor="rgba(86, 172, 206, 1)"
        endFillColor="rgba(86, 172, 206, 1)"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={5}
        maxValue={100}
        rulesColor="gray"
        yAxisColor="white"
        yAxisThickness={0}
        yAxisTextStyle={{ color: 'gray' }}
        yAxisLabelSuffix="%"
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
