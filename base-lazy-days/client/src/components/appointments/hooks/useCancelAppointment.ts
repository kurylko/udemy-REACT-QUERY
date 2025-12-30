import { Appointment } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, patchData);
};

export function useCancelAppointment() {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // useMutation to cancel appointment
  const {mutate} = useMutation({
    mutationFn: removeAppointmentUser,  // no need to pass userId here
    //   // passing appointment to remove the userId on the appointment
    //   removeAppointmentUser(appointment),  
    // // callbacks for success and error handling
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] }); // refetch appointments after mutation
      toast({
        title: "Appointment canceled successfully!",  
        status: "success",
        variant: "subtle",
        isClosable: true,
      });
    }

  });

  return { mutate };
};
