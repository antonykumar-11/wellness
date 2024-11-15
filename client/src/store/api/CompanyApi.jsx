import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "companyApi",
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
    // Create a company
    createCompany: builder.mutation({
      query: (companyDetails) => ({
        url: "/companies",
        method: "POST",
        body: companyDetails,
      }),
    }),

    // Read all companies
    getCompanies: builder.query({
      query: () => "/companies",
    }),

    // Read a single company by ID
    getCompanyById: builder.query({
      query: (id) => `/companies/${id}`,
    }),

    // Update a company
    updateCompany: builder.mutation({
      query: ({ id, ...companyDetails }) => {
        // Log the id and companyDetails to check the data being passed
        console.log("ID:", id);
        console.log("Company Details:", companyDetails);

        // Proceed with the request
        return {
          url: `/companies/${id}`, // Use the id for the endpoint
          method: "PUT", // Use PUT for updating the company
          body: companyDetails, // Pass the rest of the company details as the body
        };
      },
    }),

    // Delete a company
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
