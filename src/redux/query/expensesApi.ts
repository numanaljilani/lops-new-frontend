import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
      console.log(token, "TOKEN");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
        console.log(data, "API");
        return {
          url: `expenses/?page=${data?.page || 1}&${
            data?.job_card && `job_card=` + data?.job_card
          }`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createExpense: builder.mutation({
      query: (data) => {
        console.log(data, "API");
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
    getExpenseById: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `expenses/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useExpensescategoriesMutation,
  useExpensesMutation,
  useCreateExpenseMutation,
  useGetExpenseByIdMutation,
} = expensesApi;
