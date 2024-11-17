import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API slice
export const customerApi = createApi({
  reducerPath: "customerApi", // A unique key for the reducer
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`, // Correct usage of fetchBaseQuery
  }),
  endpoints: (builder) => ({
    // Fetch all customers
    getAllCustomers: builder.query({
      query: () => "customers", // This will match the endpoint: GET /api/customers
    }),

    // Fetch customer by phone number
    getCustomerByPhone: builder.query({
      query: (phone_number) => `customers/${phone_number}`, // GET /api/customers/:phone_number
    }),

    // Create a new customer
    createCustomer: builder.mutation({
      query: (newCustomer) => ({
        url: "customers", // POST /api/customers
        method: "POST",
        body: newCustomer,
      }),
    }),

    // Update a customer by id
    updateCustomer: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `customers/${id}`, // PUT /api/customers/:id
        method: "PUT",
        body: updatedData,
      }),
    }),

    // Delete a customer by id
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`, // DELETE /api/customers/:id
        method: "DELETE",
      }),
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllCustomersQuery,
  useGetCustomerByPhoneQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
