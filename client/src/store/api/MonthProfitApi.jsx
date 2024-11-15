// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API slice
export const monthProfitApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
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
  tagTypes: ["MonthProfit"], // Tags for caching and invalidating data
  endpoints: (builder) => ({
    // Read: Fetch all Month Profits
    getMonthProfits: builder.query({
      query: () => "/profits",
      providesTags: ["MonthProfit"],
    }),

    // Read: Fetch a specific Month Profit by ID
    getMonthProfitById: builder.query({
      query: (id) => `/profits/${id}`, // Fetch by ID
      providesTags: (result, error, id) => [{ type: "MonthProfit", id }],
    }),

    // Create: Add a new profit entry
    addMonthProfit: builder.mutation({
      query: (newProfit) => ({
        url: "/profits",
        method: "POST",
        body: newProfit,
      }),
      invalidatesTags: ["MonthProfit"],
    }),

    // Update: Edit an existing profit entry by ID
    updateMonthProfit: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/profits/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MonthProfit", id }],
    }),

    // Delete: Remove a profit entry by ID
    deleteMonthProfit: builder.mutation({
      query: (id) => ({
        url: `/profits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "MonthProfit", id }],
    }),
  }),
});

// Export hooks for queries and mutations
export const {
  useGetMonthProfitsQuery,
  useGetMonthProfitByIdQuery,
  useAddMonthProfitMutation,
  useUpdateMonthProfitMutation,
  useDeleteMonthProfitMutation,
} = monthProfitApi;
