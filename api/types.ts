import { TextStyle } from 'react-native';

export interface ISensor {
  temperature: number;
  humidity: number;
}

export interface ITimer {
  total_time: number;
  current_time: number;
}

// export type IUpdateTimer = { action: 'add' | 'reduce' } & (
//   | Pick<ITimer, 'total_time'>
//   | Pick<ITimer, 'current_time'>
// );

export interface IUpdateTimer {
  action: 'add' | 'reduce' | 'change';
  time?: number;
}

export interface IMotorStates {
  motor_a: 0 | 1;
  motor_b: 0 | 1;
  motor_c: 0 | 1;
}

export interface IReadings {
  sensor_values: ISensor;
  time_values: ITimer;
  motor_states: IMotorStates;
}
export interface IInternalConfig extends TemperatureTime {
  name: string;
}

export interface IControllerConfig extends TemperatureTime {
  status: 'on' | 'off';
}

interface TemperatureTime {
  starting_temperature: number;
  time: number;
}

export interface IManageController {
  action: 'activate' | 'deactivate' | 'stop';
}

export type CustomEvents = 'sensors' | 'time' | 'states' | 'controller';

export interface IDataChart {
  data: {
    value: number;
    timestamp: string;
    label?: string;
    labelTextStyle?: TextStyle;
  }[];
}
