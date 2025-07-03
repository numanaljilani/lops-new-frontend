import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/employee`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
     
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    employee: builder.mutation({
      query: ({ page , search }) => {
        return {
          // url: `/?page=${page || 1}`,
          url: `/?page=${page || 1}&search=${search || ''}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    projectEmployee: builder.mutation({
      query: ({ page , id  }) => {
        console.log(id , "projectEmployee")
        return {
          // url: `/?page=${page || 1}`,
          url: `/project-employee/?projectId=${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createEmployee: builder.mutation({
      query: (data) => {
        console.log(data, "Inide Api");
        return {
          url: "/",
          method: "POST",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteEmployee: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}/`,
          method: "Delete",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    employeeDetails: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}/`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    patchEmployee: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}/`,
          method: "PUT",
          body: data.details,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
  useCreateEmployeeMutation,
  useEmployeeDetailsMutation,
  usePatchEmployeeMutation,
  useProjectEmployeeMutation
} = employeeApi;
