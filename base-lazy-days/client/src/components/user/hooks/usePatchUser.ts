import jsonpatch from "fast-json-patch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { toast } from "@/components/app/toast";
import { queryKeys } from "@/react-query/constants";


export const MUTATION_KEY = 'patchUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
 ): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    },
  );
  return data.user;
 };


export function usePatchUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // useMutation to patch user data
  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User | null) => patchUserOnServer(newData, user),
    onSuccess: (updatedUser) => {
      // update user in the cache
      if (updatedUser) {
        //updateUser(updatedUser); // updating user in the cache WITH NEW TOKEN - creates new user object
        toast({
          title: "User updated successfully!",
          status: "success",
          variant: "subtle",
        })
      }
    },
    // Optimistic UI update - update cache before server responds
    onSettled: () => {
      // invalidate user query to refetch fresh data
      if (user) {
        // return promsise to maintain 'InProgress' state until invalidation is done
       return queryClient.invalidateQueries({
          queryKey: [queryKeys.user],
        });
      }
    },
  });
  
  return patchUser;
};
