import { useState, useCallback } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery } from "@tanstack/react-query";

// query function for useQuery  
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback((data: Staff[]) => {
    if(filter === "all") return data; 

    return filterByTreatment(data, filter);
  }, [filter]);

  const fallbackStaff : Staff[] = [];

  // getting data from server via useQuery
  const {data: staff = fallbackStaff } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn, //if filter changes, selectFn changes
  }); 


  return { staff, filter, setFilter };
}
