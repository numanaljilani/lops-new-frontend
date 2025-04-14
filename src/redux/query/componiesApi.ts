import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/` }),
  endpoints: (builder) => ({
    componies: builder.mutation({
        query: ({page}) => {
          return {
            url: `companies/?page=${page || 1 }`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createCompany: builder.mutation({
        query: (data) => {
          return {
            url: "companies/",
            method: "POST",
            body: data,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      deleteCompany: builder.mutation({
        query: (data) => {
          return {
            url: `companies/${data?.id}/`,
            method: "Delete",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${data?.token}`,
            },
          };
        },
      }),
      companyDetails: builder.mutation({
        query: (data) => {
          return {
            url: `companies/${data.id}/`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${data.token}`,
            },
          };
        },
      }),
      patchCompany: builder.mutation({
        query: (data) => {
          return {
            url: `companies/${data.id}/`,
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
export const { useDeleteCompanyMutation , useComponiesMutation ,useCreateCompanyMutation , useCompanyDetailsMutation , usePatchCompanyMutation} = companiesApi