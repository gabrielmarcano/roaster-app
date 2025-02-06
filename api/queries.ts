import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getControllerConfig,
  manageController,
  resetMicro,
  updateControllerConfig,
  updateTimer,
} from '@/api/api';
import { IControllerConfig } from './types';

export const useUpdateTimer = (config?: object) =>
  useMutation({
    mutationFn: updateTimer,
    ...config
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['fetchReadings']);
    // },
  });

export const useGetControllerConfig = (config?: object) =>
  useQuery({
    queryKey: ['fetchControllerConfig'],
    queryFn: getControllerConfig,
    ...config,
  });

export const useUpdateControllerConfig = (body: Partial<IControllerConfig>, config?: object) =>
  useMutation({
    mutationFn: () => updateControllerConfig(body),
    ...config
    // onSuccess: () => {
    //   queryClient.invalidateQueries(['fetchReadings']);
    // },
  });

export const useManageController = (config?: object) =>
  useMutation({
    mutationFn: manageController,
    ...config
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['fetchReadings']);
    // },
  });

export const useResetMicro = (config?: object) =>
  useMutation({
    mutationFn: resetMicro,
    ...config
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['fetchReadings']);
    // },
  });
