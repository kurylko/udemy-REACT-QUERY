import type { Treatment } from "@shared/types";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // TODO: get data from server via useQuery
  const { data } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  }); 
    return data || [];
}

export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments], // data in a cache is identified by its queryKey
    queryFn: getTreatments,
  });
}
