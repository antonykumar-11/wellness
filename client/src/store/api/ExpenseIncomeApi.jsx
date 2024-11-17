import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseIncomeApiSlice = createApi({
  reducerPath: "expenseIncomeApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
  }),
  endpoints: (builder) => ({
    getIncome: builder.query({
      query: () => "expenseincomes",
    }),
    getIncomeById: builder.query({
      query: (id) => `expenseincomes/${id}`,
    }),
    createIncome: builder.mutation({
      query: (newExpense) => ({
        url: "expenseincomes",
        method: "POST",
        body: newExpense,
      }),
    }),
    updateIncomeById: builder.mutation({
      query: ({ id, ...updatedExpense }) => ({
        url: `expenseincomes/${id}`,
        method: "PUT",
        body: updatedExpense,
      }),
    }),
    deleteIncomeById: builder.mutation({
      query: (id) => ({
        url: `expenseincomes/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetIncomeQuery,
  useGetIncomeByIdQuery,
  useCreateIncomeMutation,
  useUpdateIncomeByIdMutation,
  useDeleteIncomeByIdMutation,
} = expenseIncomeApiSlice;
