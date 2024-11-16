// src/redux/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for the API
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/`;

// Define the API slice
export const expenseApiSlice = createApi({
  reducerPath: "expenseApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl,
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
      query: () => "expenseexpense/expenses",
    }),
    getExpenseById: builder.query({
      query: (id) => {
        console.log("Fetching expense with ID:", id); // Log the ID to the console
        return `expenseexpense/expenses/${id}`;
      },
      transformResponse: (response) => {
        console.log("Response:", response); // Log the response if needed
        return response;
      },
    }),
    // Create a new expense
    createExpense: builder.mutation({
      query: (newExpense) => ({
        url: "expenseexpense/expenses",
        method: "POST",
        body: newExpense,
      }),
    }),
    // Update an expense
    updateExpenseById: builder.mutation({
      query: ({ id, ...updatedExpense }) => ({
        url: `expenseexpense/expenses/${id}`,
        method: "PUT",
        body: updatedExpense,
      }),
    }),
    // Delete an expense
    deleteExpenseById: builder.mutation({
      query: (id) => ({
        url: `expenseexpense/expenses/${id}`,
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
} = expenseApiSlice;
