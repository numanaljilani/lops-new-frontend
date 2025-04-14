import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/client_new/` }),
  endpoints: (builder) => ({
    payments: builder.mutation({
      query: ({id}) => {
        return {
          url: `paymentballs/?job_card=${id}`,
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
    updateTtasks: builder.mutation({
      query: ({data , id }) => {
        // console.log(data , "API")
        return {
          url: `tasks/${id}/`,
          method: "PUT",
          body : data ,
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
          url: "paymentballs/",
          method: "POST",
          body: data.data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createTask: builder.mutation({
      query: (data) => {
        // console.log(data , "API")
        return {
          url: "tasks/",
          method: "POST",
          body: data.data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deleteTask: builder.mutation({
      query: ({id , token}) => {
  
        return {
          url: `tasks/${id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${token}`,
          },
        };
      },
    }),
    deletePaymentBall: builder.mutation({
      query: (data) => {
        // console.log("delet client ", data);
        return {
          url: `paymentballs/${data?.id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data?.token}`,
          },
        };
      },
    }),
    jobDetails: builder.mutation({
      query: (data) => {
        return {
          url: `paymentballs/${data.id}/`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    patchClient: builder.mutation({
      query: (data) => {
        return {
          url: `paymentballs/${data.id}/`,
          method: "PATCH",
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
  useJobDetailsMutation,
  usePaymentsMutation,
  useTasksMutation,
  useCreateTaskMutation,
  useDeletePaymentBallMutation,
  usePatchClientMutation,
  useCreateBallMutation,
  useUpdateTtasksMutation,
  useDeleteTaskMutation
} = paymentApi;
