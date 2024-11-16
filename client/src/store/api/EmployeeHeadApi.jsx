// src/api/employeeApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeeHeadApi = createApi({
  reducerPath: "employeeHeadApii",
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
    getEmployees: builder.query({
      query: () => "employeehead/employees",
    }),
    getEmployeeById: builder.query({
      query: (id) => `employeehead/employees/${id}`,
    }),
    addEmployee: builder.mutation({
      query: (newEmployee) => ({
        url: "employeehead/employees",
        method: "POST",
        body: newEmployee,
      }),
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...updatedEmployee }) => ({
        url: `employeehead/employees/${id}`,
        method: "PUT",
        body: updatedEmployee,
      }),
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `employeehead/employees/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeHeadApi;
