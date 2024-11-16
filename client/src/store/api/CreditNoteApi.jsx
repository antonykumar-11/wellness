import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const creditNoteApi = createApi({
  reducerPath: "creditNoteApi",
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
    getCreditNotes: builder.query({
      query: () => "creditnote/credit-notes",
    }),
    getCreditNoteById: builder.query({
      query: (transactionId) => `creditnote/credit-notes/${transactionId}`,
    }),
    createCreditNote: builder.mutation({
      query: (newNote) => ({
        url: "creditnote/credit-notes",
        method: "POST",
        body: newNote,
      }),
    }),
    updateCreditNote: builder.mutation({
      query: ({ transactionId, updatedPurchase }) => ({
        url: `creditnote/credit-notes/${transactionId}`,
        method: "PUT",
        body: updatedPurchase,
      }),
    }),
    deleteCreditNote: builder.mutation({
      query: (transactionId) => ({
        url: `creditnote/credit-notes/${transactionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCreditNotesQuery,
  useGetCreditNoteByIdQuery,
  useCreateCreditNoteMutation,
  useUpdateCreditNoteMutation,
  useDeleteCreditNoteMutation,
} = creditNoteApi;
