import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const invoicesApi = createApi({
  reducerPath: "iinvoicesApi",
  baseQuery: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`, // Your backend base URL
  endpoints: (builder) => ({
    getAllInvoices: builder.query({
      query: () => "invoices/invoice",
    }),
    getInvoiceById: builder.query({
      query: (id) => `invoices/invoice/${id}`,
    }),
    createInvoice: builder.mutation({
      query: (invoice) => ({
        url: "invoices/invoice",
        method: "POST",
        body: invoice,
      }),
    }),
    updateInvoice: builder.mutation({
      query: ({ id, ...invoice }) => ({
        url: `invoices/invoice/${id}`,
        method: "PUT",
        body: invoice,
      }),
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `invoices/invoice/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApi;
