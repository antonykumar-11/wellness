// src/services/ledgerApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/`;

export const getaAlledgerApi = createApi({
  reducerPath: "getaAlledgerApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fetchLedgersWithTransactions: builder.query({
      query: () => "/ledgers",
    }),
  }),
});

export const { useFetchLedgersWithTransactionsQuery } = getaAlledgerApi;
