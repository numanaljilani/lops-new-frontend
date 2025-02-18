import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/` }),
  endpoints: (builder) => ({
    employee: builder.mutation({
        query: (data) => {
          return {
            url: "employees",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createEmployee: builder.mutation({
      query: (data) => {
          console.log(data , "Inide Api")
          return {
            url: "employees/",
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
            url: `employees/${data.id}/`,
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
            url: `employees/${data.id}/`,
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
            url: `employees/${data.id}/`,
            method: "PATCH",
            body : data.details,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${data.token}`,
            },
          };
        },
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useDeleteEmployeeMutation , useEmployeeMutation ,useCreateEmployeeMutation , useEmployeeDetailsMutation , usePatchEmployeeMutation} = employeeApi