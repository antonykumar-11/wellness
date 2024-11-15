import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ledgerPayHeadApi = createApi({
  reducerPath: "ledgerPayHeadApi",
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
        url: "ledger/ledger",
        method: "POST",
        body: newPurchase,
      }),
    }),
    getLedger: builder.query({
      query: () => "ledger/ledger",
    }),
    getLedgerById: builder.query({
      query: (id) => `ledger/ledger/${id}`,
    }),
    updateLedger: builder.mutation({
      query: ({ id, updatedPurchase }) => ({
        url: `ledger/ledger/${id}`,
        method: "PUT",
        body: updatedPurchase,
      }),
    }),
    deleteLedger: builder.mutation({
      query: (id) => ({
        url: `ledger/ledger/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLedgerMutation,
  useGetLedgerQuery,
  useGetLedgerByIdQuery,
  useUpdateLedgerMutation,
  useDeleteLedgerMutation,
} = ledgerPayHeadApi;
