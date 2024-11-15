import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: () => "attendances", // Original endpoint remains unchanged
    }),

    getAttendanceById: builder.query({
      query: ({ id, date, startDate, endDate } = {}) => {
        let url = "/attendances";
        const params = new URLSearchParams();

        if (id) params.append("employeeId", id);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        return url;
      },
    }),
    getAttendancesByParams: builder.query({
      query: ({ employeeId, date, startDate, endDate } = {}) => {
        let url = "attendances";
        const params = new URLSearchParams();

        if (employeeId) params.append("employeeId", employeeId);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        return url;
      },
    }),

    createAttendance: builder.mutation({
      query: (newAttendance) => ({
        url: "attendances",
        method: "POST",
        body: newAttendance,
      }),
    }),
    updateAttendance: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `attendances/${id}`,
        method: "PUT",
        body: update,
      }),
    }),
    deleteAttendance: builder.mutation({
      query: ({ id, date }) => ({
        url: `attendances/${id}`,
        method: "DELETE",
        body: { date }, // Pass date in the request body
      }),
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceByIdQuery,
  useGetAttendancesByParamsQuery, // New hook for the parameterized query
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
