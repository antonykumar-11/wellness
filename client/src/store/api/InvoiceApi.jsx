import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
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
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: () => ({
        url: "invoice/invoices",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Invoice", id })), "Invoice"]
          : ["Invoice"],
    }),
    getSingleInvoice: builder.query({
      query: (id) => ({
        url: `invoice/invoices/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),
    postInvoice: builder.mutation({
      query: (data) => ({
        url: `invoice/invoices`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Invoice"],
    }),
    patchInvoice: builder.mutation({
      query: ({ data, id }) => ({
        url: `invoice/invoices/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Invoice", id }],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `invoice/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetSingleInvoiceQuery,
  usePostInvoiceMutation,
  usePatchInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi;
