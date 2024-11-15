import { useMutation, useQuery } from '@tanstack/react-query';

import { getReadings, updateMotors, updateTimer } from '@/api/api';

export const useReadings = (config?: object) =>
  useQuery({ queryKey: ['fetchReadings'], queryFn: getReadings, ...config });

export const useUpdateTimer = () =>
  useMutation({
    mutationFn: updateTimer,
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['fetchReadings']);
    // },
  });

export const useUpdateMotors = () =>
  useMutation({
    mutationFn: updateMotors,
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['fetchReadings']);
    // },
  });
