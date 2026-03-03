import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteInternalConfig,
  getControllerConfig,
  getInternalConfig,
  manageController,
  manageMotors,
  resetMicro,
  updateControllerConfig,
  updateInternalConfig,
  updateTimer,
} from '@/api/api';

export const useUpdateTimer = () =>
  useMutation({
    mutationFn: updateTimer,
  });

export const useInternalConfig = () =>
  useQuery({
    queryKey: ['fetchInternalConfig'],
    queryFn: getInternalConfig,
  });

export const useUpdateInternalConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInternalConfig,
    onSuccess(data) {
      queryClient.setQueryData(['fetchInternalConfig'], data);
    },
  });
};

export const useDeleteInternalConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInternalConfig,
    onSuccess(data) {
      queryClient.setQueryData(['fetchInternalConfig'], data);
    },
  });
};

export const useControllerConfig = () =>
  useQuery({
    queryKey: ['fetchControllerConfig'],
    queryFn: getControllerConfig,
  });

export const useUpdateControllerConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateControllerConfig,
    onSuccess(data) {
      queryClient.setQueryData(['fetchControllerConfig'], data);
    },
  });
};

export const useManageController = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: manageController,
    onSuccess(data) {
      queryClient.setQueryData(['fetchControllerConfig'], data);
    },
  });
};

export const useManageMotors = () =>
  useMutation({
    mutationFn: manageMotors,
  });

export const useResetMicro = () =>
  useMutation({
    mutationFn: resetMicro,
  });
