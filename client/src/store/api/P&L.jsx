// src/redux/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API

// Define the API slice
export const profitAndLossApiSlice = createApi({
  reducerPath: "expenseApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/", // Corrected the URL
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
    // Fetch all expenses
    getExpenses: builder.query({
      query: () => "expenseexpensee/expenses",
    }),
    // Fetch all expenses
    getAllExpense: builder.query({
      query: () => "expenseexpensee/expensess",
    }),
    getExpenseById: builder.query({
      query: (id) => {
        console.log("Fetching expense with ID:", id); // Log the ID to the console
        return `expenseexpensee/expenses/${id}`;
      },
      transformResponse: (response, meta, arg) => {
        console.log("Response:", response); // Log the response if needed
        return response;
      },
    }),
    // Create a new expense
    createExpense: builder.mutation({
      query: (newExpense) => ({
        url: "expenseexpensee/expenses",
        method: "POST",
        body: newExpense,
      }),
    }),
    // Update an expense
    updateExpenseById: builder.mutation({
      query: ({ id, ...updatedExpense }) => ({
        url: `expenseexpensee/expenses/${id}`,
        method: "PUT",
        body: updatedExpense,
      }),
    }),
    // Delete an expense
    deleteExpenseById: builder.mutation({
      query: (id) => ({
        url: `expenseexpensee/expenses/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseByIdMutation,
  useDeleteExpenseByIdMutation,
  useGetAllExpenseQuery,
} = profitAndLossApiSlice;
