import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/payment`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    payments: builder.mutation({
      query: ({ id,page }) => {
        console.log(id, "paymentsAPI");
        return {
          // url: `/?projectId=${id || ''}`,
          url: `/?projectId=${id || ""}&page=${page || 1}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    tasks: builder.mutation({
      query: (data) => {
        // console.log(data , "API")
        return {
          url: `tasks/?payment_ball=${data.id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    updatePaymentBall: builder.mutation({
      query: ({ data, id }) => {
        // console.log(data , "API")
        return {
          url: `/${id}`,
          method: "PUT",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createBall: builder.mutation({
      query: (data) => {
        // console.log(data , "API")
        return {
          url: "/",
          method: "POST",
          body: data.data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deletePaymentBall: builder.mutation({
      query: (data) => {
        // console.log("delet client ", data);
        return {
          url: `/${data?.id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data?.token}`,
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  usePaymentsMutation,
  useDeletePaymentBallMutation,
  useCreateBallMutation,
  useUpdatePaymentBallMutation
} = paymentApi;
