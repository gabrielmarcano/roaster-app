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
  action: 'add' | 'reduce';
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

export interface IControllerConfig {
  mode: 'cafe' | 'cacao' | 'mani';
  starting_temperature: number;
  time: number;
}

export interface IManageController {
  action: 'activate' | 'deactivate' | 'stop';
}

export interface IControllerStatus {
  status: 'on' | 'off';
}

export interface IController extends IControllerConfig, IControllerStatus {}

export type CustomEvents = "sensors" | "time" | "states" | "controller"