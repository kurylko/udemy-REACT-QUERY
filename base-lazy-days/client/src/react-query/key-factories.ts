import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, ) => {
    // excluded userToken from key to avoid exposing it in devtools
    // wanr the key to be consistent across sessions for the same user
    return [queryKeys.user, userId];
};

export const generateUserAppointmentsKey = (userId: number, userToken: string) => {
    return [queryKeys.appointments, userId, userToken];
};

export const generateStaffKey = (userToken: string) => {
    return [queryKeys.staff, userToken];
};