import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const payHeadDetailsApi = createApi({
  reducerPath: "payHeadDetailsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/", // Corrected the URL
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
    getPayHeadDetails: builder.query({
      query: ({ employeeId, date, startDate, endDate } = {}) => {
        let url = "/payHeadDetails";
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

    getPayHeadDetailsById: builder.query({
      query: ({ employeeId, date, startDate, endDate } = {}) => {
        let url = "/payHeadDetails";
        const params = new URLSearchParams();

        // Append parameters if they are provided
        if (employeeId) params.append("employeeId", employeeId);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        // Add parameters to URL if any exist
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        return url;
      },
    }),

    // Create new pay head details
    createPayHeadDetails: builder.mutation({
      query: (newPayHeadDetails) => ({
        url: "/payHeadDetails",
        method: "POST",
        body: newPayHeadDetails,
      }),
    }),

    updatePayHeadDetails: builder.mutation({
      query: ({ employeeId, ...updatedPayHeadDetails }) => ({
        url: `/payHeadDetails/${employeeId}`,
        method: "PUT",
        body: updatedPayHeadDetails,
      }),
    }),
    deletePayHeadDetails: builder.mutation({
      query: (id) => ({
        url: `/payHeadDetails/${id}`,
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
