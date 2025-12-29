import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";

import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { App } from "@/components/app/App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { s } from "vitest/dist/reporters-O4LBziQ_";

// for useQuery call
async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}
  const commonOptions = {
    staleTime: 0, // 5 minutes - for refreshing data after this time (data remains fresh for this time)
    gcTime: 300000,   // 5 minutes - for removing data from cache after this time (garbage collection time)
  };

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments() {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { userId } = useLoginData();

  const selectFn = useCallback((data: AppointmentDateMap, showAll: boolean) => { //memoized with useCallback
    if(showAll) return data;

    return getAvailableAppointments(data, userId);
  }, [userId, showAll]); 

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

const queryClient = useQueryClient();

useEffect(() => {
  const prevMonthYear = getNewMonthYear(monthYear, -1);
  const nextMonthYear = getNewMonthYear(monthYear, 1);

  queryClient.prefetchQuery({
    queryKey: [queryKeys.appointments, prevMonthYear.year, prevMonthYear.month],
    queryFn: () => getAppointments(prevMonthYear.year, prevMonthYear.month),   
    ...commonOptions 
  });
  queryClient.prefetchQuery({
    queryKey: [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
    queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),    
    ... commonOptions
  });
}, [monthYear, queryClient]); //prefetch when monthYear changes

  const fallback : AppointmentDateMap = {};
  
  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    // keepPreviousData: true, // optional
    select: (data) => selectFn(data, showAll), // always runs
    staleTime: 0, // 5 minutes - for refreshing data after this time (data remains fresh for this time)
    gcTime: 300000,   // 5 minutes - for removing data from cache after this time (garbage collection time)
    refetchOnWindowFocus: true, // do not refetch data when window regains focus (new tab) 
    ...commonOptions
  });

  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month
  //const appointments: AppointmentDateMap = {};

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
