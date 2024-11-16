import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const debitNoteApi = createApi({
  reducerPath: "debitNoteApi",
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
  endpoints: (builder) => ({
    getDebitNotes: builder.query({
      query: () => "debitnote/debit-notes",
    }),
    getDebitNoteById: builder.query({
      query: (id) => `debitnote/debit-notes/${id}`, // Updated URL
    }),
    createDebitNote: builder.mutation({
      query: (newNote) => ({
        url: "debitnote/debit-notes",
        method: "POST",
        body: newNote,
      }),
    }),
    updateDebitNote: builder.mutation({
      query: ({ transactionId, updatedPurchase }) => ({
        url: `debitnote/debit-notes/${transactionId}`, // Updated URL
        method: "PUT",
        body: updatedPurchase,
      }),
    }),
    deleteDebitNote: builder.mutation({
      query: (transactionId) => ({
        url: `debitnote/debit-notes/${transactionId}`, // Updated URL
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDebitNotesQuery,
  useGetDebitNoteByIdQuery,
  useCreateDebitNoteMutation,
  useUpdateDebitNoteMutation,
  useDeleteDebitNoteMutation,
} = debitNoteApi;
