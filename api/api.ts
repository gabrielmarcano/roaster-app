import { AxiosResponse } from 'axios';

import {
  ITimer,
  IUpdateTimer,
  IControllerConfig,
  IManageController,
  IControllerStatus,
  // IMotorStates,
  // IReadings,
} from '@/api/types';
import client from '@/api/client';

export const updateTimer = (
  body: IUpdateTimer,
): Promise<AxiosResponse<ITimer>> => client.post('/time', body);

export const getControllerConfig = (): Promise<
  AxiosResponse<IControllerConfig>
> => client.get('/config');

export const updateControllerConfig = (
  body: Partial<IControllerConfig>,
): Promise<AxiosResponse<IControllerConfig>> => client.patch('/config', body);

export const manageController = (
  body: IManageController,
): Promise<AxiosResponse<IControllerStatus>> =>
  client.post('/controller', body);

export const resetMicro = (): Promise<AxiosResponse<void>> =>
  client.post('/reset');

// MOCK

// const mockAxiosResponse = {
//   // `data` is the response that was provided by the server
//   data: {},

//   // `status` is the HTTP status code from the server response
//   status: 200,

//   // `statusText` is the HTTP status message from the server response
//   // As of HTTP/2 status text is blank or unsupported.
//   // (HTTP/2 RFC: https://www.rfc-editor.org/rfc/rfc7540#section-8.1.2.4)
//   statusText: 'OK',

//   // `headers` the HTTP headers that the server responded with
//   // All header names are lower cased and can be accessed using the bracket notation.
//   // Example: `response.headers['content-type']`
//   headers: {},

//   // `config` is the config that was provided to `axios` for the request
//   config: {},

//   // `request` is the request that generated this response
//   // It is the last ClientRequest instance in node.js (in redirects)
//   // and an XMLHttpRequest instance in the browser
//   request: {},
// } as AxiosResponse;

// const timerMock = {
//   total_time: 122,
//   current_time: 70,
// } as ITimer;

// const motorStatesMock = {
//   motor_a: 1,
//   motor_b: 0,
//   motor_c: 1,
// } as IMotorStates;

// const readingsMock = {
//   sensor_values: {
//     temperature: 120,
//     humidity: 70,
//   },
//   time_values: timerMock,
//   motor_states: motorStatesMock,
// } as IReadings;

// const mockResponse = (data: any, body?: any) => ({
//   ...mockAxiosResponse,
//   data: { ...data, ...body },
// });


// export const updateTimer = (
//   body: IUpdateTimer,
// ): Promise<AxiosResponse<ITimer>> =>
//   Promise.resolve(mockResponse(timerMock, body));
