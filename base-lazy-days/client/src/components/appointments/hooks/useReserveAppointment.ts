import { Appointment } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
};

export function useReserveAppointment() {
  const { userId } = useLoginData();
  const queryClient = useQueryClient();

  const toast = useCustomToast();

  // useMutation - no chache update needed here (no chache data, no retries, no staleTime)
 const {mutate} = useMutation({
    mutationFn: (appointment: Appointment) =>
      // passing appointment and userId to set the userId on the appointment
      setAppointmentUser(appointment, userId),  

   // callbacks for success and error handling
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] }); // refetch appointments after mutation
      toast({
        title: "Appointment reserved successfully!",
        status: "success",
        variant: "subtle",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Could not reserve appointment",
        status: "error",  
        variant: "subtle",
        isClosable: true,
      });
    }
  });

  return {  mutate };
};
