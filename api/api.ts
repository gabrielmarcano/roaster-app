import { AxiosResponse } from 'axios';

import { ITimer, IUpdateTimer, IMotorStates, IReadings } from '@/api/types';
import client from '@/api/client';

export const getReadings = (): Promise<AxiosResponse<IReadings>> =>
  client.get<IReadings>('/readings');

export const updateTimer = (
  body: IUpdateTimer,
): Promise<AxiosResponse<ITimer>> =>
  client.patch<ITimer, AxiosResponse<ITimer>, IUpdateTimer>('/timer', body);

export const updateMotors = (
  body: Partial<IMotorStates>,
): Promise<AxiosResponse<IMotorStates>> => client.patch('/motors', body);
