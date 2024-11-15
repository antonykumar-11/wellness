import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for the API
const baseUrl = "http://localhost:8000/api/v1/";

// Define the API slice
export const AssetApiSlice = createApi({
  reducerPath: "AssetApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources
      console.log("Token:", token); // Log token for debugging
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch all assets and expenses
    getExpenses: builder.query({
      query: () => {
        console.log("Fetching assets..."); // Add console log to check if query is being called
        return "assets/assets"; // Assuming this is the correct endpoint
      },
      transformResponse: (response) => {
        console.log("Response received:", response); // Log response to inspect it
        return response; // Return response to make it available in your component
      },
    }),
  }),
});

export const { useGetExpensesQuery } = AssetApiSlice;
