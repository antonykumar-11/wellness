import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`, // Correct usage of fetchBaseQuery
  }),
  tagTypes: ["Ledger"],
  endpoints: (builder) => ({
    getAllLedgersWithTransactions: builder.query({
      query: () => ({
        url: "ledgers/all",
        method: "GET",
      }),
      providesTags: (result) => {
        console.log("API result:", result);
        if (!result || !Array.isArray(result)) {
          return [{ type: "Ledger", id: "LIST" }];
        }
        return [
          ...result.map(({ id }) => ({ type: "Ledger", id })), // Map each ledger to a tag
          { type: "Ledger", id: "LIST" }, // Add a tag for the list
        ];
      },
    }),
    getLedgerBalance: builder.query({
      query: (ledgerId) => `ledger/balance/${ledgerId}`,
    }),
  }),
});

export const {
  useGetAllLedgersWithTransactionsQuery,
  useGetLedgerBalanceQuery,
} = ledgerApi;
