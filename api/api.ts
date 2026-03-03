import { AxiosResponse } from 'axios';

import {
  ITimer,
  IUpdateTimer,
  IControllerConfig,
  IManageController,
  IInternalConfig,
  IConfigMap,
  IResetResponse,
  IMotorStates,
} from '@/api/types';
import client from '@/api/client';

export const updateTimer = (
  body: IUpdateTimer,
): Promise<AxiosResponse<ITimer>> => client.post('/time', body);

export const getInternalConfig = (): Promise<AxiosResponse<IConfigMap>> =>
  client.get('/config');

export const updateInternalConfig = (
  body: IInternalConfig,
): Promise<AxiosResponse<IConfigMap>> => client.post('/config', body);

export const deleteInternalConfig = (
  name: string,
): Promise<AxiosResponse<IConfigMap>> =>
  client.delete(`/config/${encodeURIComponent(name)}`);

export const getControllerConfig = (): Promise<
  AxiosResponse<IControllerConfig>
> => client.get('/controller_config');

export const updateControllerConfig = (
  body: Partial<IControllerConfig>,
): Promise<AxiosResponse<IControllerConfig>> =>
  client.patch('/controller_config', body);

export const manageController = (
  body: IManageController,
): Promise<AxiosResponse<IControllerConfig>> =>
  client.post('/controller', body);

export const manageMotors = (
  body: Partial<IMotorStates>,
): Promise<AxiosResponse<IMotorStates>> => client.post('/motors', body);

export const resetMicro = (): Promise<AxiosResponse<IResetResponse>> =>
  client.post('/reset');
