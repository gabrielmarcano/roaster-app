export interface ISensor {
  temperature: number;
  humidity: number;
}

export interface ITimer {
  total: number;
  current: number;
}

export type IUpdateTimer = { action: 'add' | 'reduce' } & (
  | Pick<ITimer, 'total'>
  | Pick<ITimer, 'current'>
);

export interface IMotorStates {
  motor_one: boolean;
  motor_two: boolean;
  motor_three: boolean;
}

export interface IReadings {
  sensor_values: ISensor;
  time_values: ITimer;
  motor_states: IMotorStates;
}
