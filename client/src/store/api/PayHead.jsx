import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const payHeadApi = createApi({
  reducerPath: "payHeadApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/payheads/", // Corrected the URL
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources
      console.log("token", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Create Pay Head
    addPayHead: builder.mutation({
      query: (formDataToSubmit) => ({
        url: "/employees",
        method: "POST",
        body: formDataToSubmit,
      }),
    }),
    // Read Pay Heads
    getPayHeads: builder.query({
      query: () => "payheads",
    }),
    // Read a single Pay Head by ID
    getPayHeadById: builder.query({
      query: (id) => `payheads${id}`,
    }),
    // Update Pay Head
    updatePayHead: builder.mutation({
      query: ({ id, ...payHead }) => ({
        url: `payheads${id}`,
        method: "PUT",
        body: payHead,
      }),
    }),
    // Delete Pay Head
    deletePayHead: builder.mutation({
      query: (id) => ({
        url: `payheads${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddPayHeadMutation,
  useGetPayHeadsQuery,
  useGetPayHeadByIdQuery,
  useUpdatePayHeadMutation,
  useDeletePayHeadMutation,
} = payHeadApi;
