// src/api/journalVoucherApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const journalVoucherApi = createApi({
  reducerPath: "journalVoucherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/",
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
    getAllJournalVouchers: builder.query({
      query: () => "journal-vouchers",
    }),
    getJournalVoucherById: builder.query({
      query: (id) => `journal-vouchers/${id}`,
    }),
    createJournalVoucher: builder.mutation({
      query: (newJournalVoucher) => ({
        url: "journal-vouchers",
        method: "POST",
        body: newJournalVoucher,
      }),
    }),
    updateJournalVoucher: builder.mutation({
      query: ({ id, ...updatedJournalVoucher }) => ({
        url: `journal-vouchers/${id}`,
        method: "PUT",
        body: updatedJournalVoucher,
      }),
    }),
    deleteJournalVoucher: builder.mutation({
      query: (id) => ({
        url: `journal-vouchers/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllJournalVouchersQuery,
  useGetJournalVoucherByIdQuery,
  useCreateJournalVoucherMutation,
  useUpdateJournalVoucherMutation,
  useDeleteJournalVoucherMutation,
} = journalVoucherApi;
