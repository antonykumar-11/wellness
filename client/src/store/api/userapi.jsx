import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Existing endpoints
    getAllUsers: builder.query({
      query: () => ({
        url: "auth/myprofile",
        method: "GET",
      }),
      providesTags: (result) =>
        result && result.user
          ? [
              { type: "User", id: result.user._id },
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getSingleUser: builder.query({
      query: () => ({
        url: `auth/myprofile`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    postUser: builder.mutation({
      query: (data) => ({
        url: `user/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    patchUser: builder.mutation({
      query: ({ data }) => ({
        url: `auth/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/delete/${id}`, // Ensure this matches your actual backend route
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // New login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: `auth/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: "POST",
      }),
    }),
    // New register endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: `auth/register`,
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  usePatchUserMutation,
  useDeleteUserMutation,
  usePostUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = userApi;
