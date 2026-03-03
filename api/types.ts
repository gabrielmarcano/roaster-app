import { TextStyle } from 'react-native';

export interface ISensor {
  temperature: number;
  humidity: number;
}

export interface ITimer {
  total_time: number;
  current_time: number;
}

export interface IUpdateTimer {
  action: 'add' | 'reduce' | 'change';
  time?: number;
}

export interface IMotorStates {
  motor_a: boolean;
  motor_b: boolean;
  motor_c: boolean;
}

export interface IReadings {
  sensor_values: ISensor;
  time_values: ITimer;
  motor_states: IMotorStates;
}
export interface IConfigEntry {
  starting_temperature: number;
  time: number;
}

export interface IInternalConfig extends IConfigEntry {
  name: string;
}

export interface IControllerConfig extends IConfigEntry {
  status: 'on' | 'off';
}

export type IConfigMap = Record<string, IConfigEntry>;

export interface IResetResponse {
  message: string;
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
