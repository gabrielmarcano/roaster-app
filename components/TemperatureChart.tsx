import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart, yAxisSides } from 'react-native-gifted-charts';

interface ITemperatureChart {
  data?: { value: number; date: string }[];
}

const TemperatureChart = (props: ITemperatureChart) => {
  const ptData = [
    { value: 160, date: '1 Apr 2022' },
    { value: 180, date: '2 Apr 2022' },
    { value: 190, date: '3 Apr 2022' },
    { value: 180, date: '4 Apr 2022' },
    { value: 140, date: '5 Apr 2022' },
    { value: 145, date: '6 Apr 2022' },
    { value: 160, date: '7 Apr 2022' },
    { value: 200, date: '8 Apr 2022' },

    { value: 220, date: '9 Apr 2022' },
    {
      value: 240,
      date: '10 Apr 2022',
      label: '10 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '11 Apr 2022' },
    { value: 260, date: '12 Apr 2022' },
    { value: 340, date: '13 Apr 2022' },
    { value: 320, date: '14 Apr 2022' },
    { value: 280, date: '15 Apr 2022' },
    { value: 240, date: '16 Apr 2022' },

    { value: 250, date: '17 Apr 2022' },
    { value: 285, date: '18 Apr 2022' },
    { value: 295, date: '19 Apr 2022' },
    {
      value: 300,
      date: '20 Apr 2022',
      label: '20 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 280, date: '21 Apr 2022' },
    { value: 295, date: '22 Apr 2022' },
    { value: 260, date: '23 Apr 2022' },
    { value: 255, date: '24 Apr 2022' },

    { value: 190, date: '25 Apr 2022' },
    { value: 220, date: '26 Apr 2022' },
    { value: 205, date: '27 Apr 2022' },
    { value: 230, date: '28 Apr 2022' },
    { value: 210, date: '29 Apr 2022' },
    {
      value: 200,
      date: '30 Apr 2022',
      label: '30 Apr',
      labelTextStyle: { color: 'lightgray', width: 60 },
    },
    { value: 240, date: '1 May 2022' },
    { value: 250, date: '2 May 2022' },
    { value: 280, date: '3 May 2022' },
    { value: 250, date: '4 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 210, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
    { value: 320, date: '5 May 2022' },
  ];

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
        data={ptData}
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
          pointerLabelComponent: (items: typeof ptData) => {
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
                    {items[0].value + ' C'}
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
