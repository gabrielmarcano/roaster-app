import { useMutation, useQuery } from '@tanstack/react-query';

import {
  deleteInternalConfig,
  getControllerConfig,
  getInternalConfig,
  manageController,
  resetMicro,
  updateControllerConfig,
  updateInternalConfig,
  updateTimer,
} from '@/api/api';
import {
  IControllerConfig,
  IInternalConfig,
  IManageController,
  IUpdateTimer,
} from './types';

export const useUpdateTimer = () =>
  useMutation({
    mutationFn: (body: IUpdateTimer) => updateTimer(body),
  });

export const useInternalConfig = () =>
  useQuery({
    queryKey: ['fetchInternalConfig'],
    queryFn: getInternalConfig,
  });

export const useUpdateInternalConfig = () =>
  useMutation({
    mutationFn: (body: IInternalConfig) => updateInternalConfig(body),
  });

export const useDeleteInternalConfig = () =>
  useMutation({
    mutationFn: (name: string) => deleteInternalConfig(name),
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
