import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceEmployeeApi = createApi({
  reducerPath: "attendanceEmployeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  }),
  endpoints: (builder) => ({
    getAttendancesByParams: builder.query({
      query: ({ employeeId, status, date, startDate, endDate }) => {
        const params = new URLSearchParams({
          employeeId: employeeId || "",
          status: status || "",
          date: date || "",
          startDate,
          endDate,
        }).toString(); // Ensure params are properly stringified

        console.log("Query Parameters Stringified:", startDate, endDate); // Check stringified params

        return {
          url: "attendanceemployees",
          params,
        };
      },
    }),
  }),
});

export const { useGetAttendancesByParamsQuery } = attendanceEmployeeApi;
