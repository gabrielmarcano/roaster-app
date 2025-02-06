import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getControllerConfig,
  manageController,
  resetMicro,
  updateControllerConfig,
  updateTimer,
} from '@/api/api';
import { IControllerConfig, IManageController, IUpdateTimer } from './types';

export const useUpdateTimer = () =>
  useMutation({
    mutationFn: (body: IUpdateTimer) => updateTimer(body),
  });

export const useControllerConfig = () =>
  useQuery({
    queryKey: ['fetchControllerConfig'],
    queryFn: getControllerConfig,
  });

export const useUpdateControllerConfig = () =>
  useMutation({
    mutationFn: (body: Partial<IControllerConfig>) =>
      updateControllerConfig(body),
  });

export const useManageController = () =>
  useMutation({
    mutationFn: (body: IManageController) => manageController(body),
  });

export const useResetMicro = () =>
  useMutation({
    mutationFn: () => resetMicro(),
  });
