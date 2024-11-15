import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
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
          ...result.map(({ id }) => ({ type: "Ledger", id })),
          { type: "Ledger", id: "LIST" },
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
