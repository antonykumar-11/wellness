import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taxApi = createApi({
  reducerPath: "taxApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/employeegroups`,
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
    createTax: builder.mutation({
      query: (newTax) => ({
        url: "/",
        method: "POST",
        body: newTax,
      }),
    }),
    getTaxes: builder.query({
      query: () => "/",
    }),
    getTaxById: builder.query({
      query: (id) => `/${id}`,
    }),
    updateTax: builder.mutation({
      query: ({ id, updatedTax }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedTax,
      }),
    }),
    deleteTax: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateTaxMutation,
  useGetTaxesQuery,
  useGetTaxByIdQuery,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxApi;
