import { AxiosResponse } from "axios";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance, getJWTHeader } from "@/axiosInstance";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";

import { queryKeys } from "@/react-query/constants";
import { generateUserAppointmentsKey, generateUserKey } from "@/react-query/key-factories";


// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
};

export function useUser() {
  const queryClient = useQueryClient();
  const { userId, userToken } = useLoginData();

  // Always call useQuery, but disable it if missing userId/userToken
  const { data: user } = useQuery({
    queryKey: userId && userToken ? [generateUserKey(userId, userToken)] : ['user', 'disabled'],
    queryFn: () => (userId && userToken ? getUser(userId, userToken) : Promise.resolve(null)),
    enabled: !!userId && !!userToken,
    staleTime: Infinity,
  });

  function updateUser(newUser: User): void {
    // updating the user in the query cache
    if (userId && userToken) {
      queryClient.setQueryData(
        [generateUserKey(userId, userToken)], 
        newUser
      );
    }
  };

  function clearUser() {
    // resetting the user to null in query cache - in log out scenario
    if (userId && userToken) {
      const userKey = generateUserKey(userId, userToken);
    // clearing user data and appointments from cache
      queryClient.removeQueries({ 
        queryKey: userKey,
       exact: true,
       });
      queryClient.removeQueries({ 
        queryKey: generateUserAppointmentsKey(userId, userToken),
         exact: true,
       });
     
     // queryClient.setQueryData(userKey, null);
    }
  };

  if (!userId || !userToken) {
    return { user: null, updateUser, clearUser };
  }

  return { user, updateUser, clearUser };
}
