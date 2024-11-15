// src/services/transectionTrackApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transectionTrackApi = createApi({
  reducerPath: "transectionTrackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/transection/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transection"],
  endpoints: (builder) => ({
    getAllTransections: builder.query({
      query: (body) => ({
        url: "get-transection",
        method: "POST",
        body, // Pass the body, e.g., frequency, date, etc.
      }),
      providesTags: ["Transection"],
    }),
    addTransection: builder.mutation({
      query: (newTransection) => ({
        url: "add-transection",
        method: "POST",
        body: newTransection,
      }),
      invalidatesTags: ["Transection"],
    }),
    editTransaction: builder.mutation({
      query: ({ transactionId, payload }) => {
        // Log the transactionId and payload here
        console.log("transactionId", transactionId);
        console.log("payload", payload);

        // Return the request configuration object
        return {
          url: "edit-transaction", // Make sure the endpoint URL is correct
          method: "POST",
          body: { transactionId, payload },
        };
      },
      invalidatesTags: ["Transaction"], // Ensure this tag is correct
    }),

    deleteTransection: builder.mutation({
      query: (transacationId) => ({
        url: "delete-transection",
        method: "POST",
        body: { transacationId },
      }),
      invalidatesTags: ["Transection"],
    }),
  }),
});

export const {
  useGetAllTransectionsQuery,
  useAddTransectionMutation,
  useEditTransactionMutation,
  useDeleteTransectionMutation,
} = transectionTrackApi;
