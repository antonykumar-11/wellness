import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const staffApi = createApi({
  reducerPath: "staffApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/employees",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state.auth?.user?.token || localStorage.getItem("token"); // Check both sources

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint to get all employees
    getAllEmployees: builder.query({
      query: () => "/employees",
    }),
    // Endpoint to get employee details by ID
    getEmployeeDetailsById: builder.query({
      query: (id) => `/employees/${id}`,
    }),
    // Endpoint to delete employee by ID
    deleteEmployeeById: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
    }),
    // Endpoint to create a new employee
    createEmployee: builder.mutation({
      query: (formDataToSubmit) => ({
        url: "/employees",
        method: "POST",
        body: formDataToSubmit,
      }),
    }),
    // Endpoint to update an employee by ID
    updateEmployeeById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllEmployeesQuery,
  useGetEmployeeDetailsByIdQuery,
  useDeleteEmployeeByIdMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeByIdMutation,
} = staffApi;
