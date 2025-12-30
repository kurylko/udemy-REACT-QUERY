import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useQuery } from"@tanstack/react-query";

import { useLoginData } from "@/auth/AuthContext";
import { generate } from "fast-json-patch";
import { generateUserAppointmentsKey } from "@/react-query/key-factories";

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
 const { userId, userToken } = useLoginData();
 
  if (!userId || !userToken) {
    return [];
  }

  const { data: appointments } = useQuery({
    queryKey: generateUserAppointmentsKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
    enabled: !!userId && !!userToken,
    staleTime: 300000, // 5 minutes till refetching
  });

  return appointments ?? [];
};
