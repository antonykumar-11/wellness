import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/client/",
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
    createLedger: builder.mutation({
      query: (newPurchase) => ({
        url: "ledgers",
        method: "POST",
        body: newPurchase,
      }),
    }),
    getLedger: builder.query({
      query: () => "ledgers",
    }),
    getLedgerPay: builder.query({
      query: () => "ledgers/pay",
    }),
    getLedgerAll: builder.query({
      query: () => "ledgers/all",
    }),
    getLedgerAllPurchase: builder.query({
      query: () => "ledgers/allPurchase",
    }),
    getLedgerById: builder.query({
      query: (id) => `ledgers/${id}`,
    }),
    updateLedger: builder.mutation({
      query: ({ id, updatedPurchase }) => ({
        url: `ledgers/${id}`,
        method: "PUT",
        body: updatedPurchase,
      }),
    }),
    deleteLedger: builder.mutation({
      query: (id) => ({
        url: `ledgers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLedgerMutation,
  useGetLedgerQuery,
  useGetLedgerPayQuery,
  useGetLedgerAllPurchaseQuery,
  useGetLedgerAllQuery,
  useGetLedgerByIdQuery,
  useUpdateLedgerMutation,
  useDeleteLedgerMutation,
} = ledgerApi;
