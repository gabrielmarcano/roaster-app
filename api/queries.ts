import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getControllerConfig,
  manageController,
  resetMicro,
  updateControllerConfig,
  updateTimer,
} from '@/api/api';

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

export const useUpdateControllerConfig = (config?: object) =>
  useMutation({
    mutationFn: updateControllerConfig,
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
