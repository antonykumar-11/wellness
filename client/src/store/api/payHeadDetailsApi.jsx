import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const payHeadDetailsApi = createApi({
  reducerPath: "payHeadDetailsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`, // Corrected URL
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPayHeadDetails: builder.query({
      query: ({ employeeId, date, startDate, endDate } = {}) => {
        const params = new URLSearchParams();

        if (employeeId) params.append("employeeId", employeeId);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `payHeadDetails${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        return url;
      },
    }),

    getPayHeadDetailsById: builder.query({
      query: ({ employeeId, date, startDate, endDate } = {}) => {
        const params = new URLSearchParams();

        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        // Include employeeId in the path if provided
        const url = employeeId
          ? `payHeadDetails/${employeeId}?${params.toString()}`
          : `payHeadDetails?${params.toString()}`;

        return url;
      },
    }),

    createPayHeadDetails: builder.mutation({
      query: ({ employeeId, newPayHeadDetails }) => ({
        url: `payHeadDetails/${employeeId}`,
        method: "POST",
        body: newPayHeadDetails,
      }),
    }),

    updatePayHeadDetails: builder.mutation({
      query: ({ employeeId, ...updatedPayHeadDetails }) => ({
        url: `payHeadDetails/${employeeId}`,
        method: "PUT",
        body: updatedPayHeadDetails,
      }),
    }),

    deletePayHeadDetails: builder.mutation({
      query: (id) => ({
        url: `payHeadDetails/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPayHeadDetailsQuery,
  useGetPayHeadDetailsByIdQuery,
  useCreatePayHeadDetailsMutation,
  useUpdatePayHeadDetailsMutation,
  useDeletePayHeadDetailsMutation,
} = payHeadDetailsApi;
