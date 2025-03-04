import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    expensescategories: builder.mutation({
        query: (data) => {
          return {
            url: "expense-categories",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    expenses: builder.mutation({
        query: (data) => {
          console.log(data , "API")
          return {
            url: `expenses/?job_card=${data.job_card}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createExpense: builder.mutation({
        query: (data) => {
          return {
            url: "expenses/",
            method: "POST",
            body: data.data,
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
export const { useDeleteCompanyMutation,useExpensescategoriesMutation , useExpensesMutation ,useCreateExpenseMutation , useCompanyDetailsMutation , usePatchCompanyMutation} = expensesApi