import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/task`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    tasks: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/?paymentId=${id || ""}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    myTasks: builder.mutation({
      query: ({ projectId , page }) => {
        return {
          url: `/?mytask=true&projectId=${projectId || ""}&page=${page || 1 }`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createTask: builder.mutation({
      query: (data) => {
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
    deleteTask: builder.mutation({
      query: (data) => {
        console.log("delet client ", data);
        return {
          url: `/${data?.id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    taskDetails: builder.mutation({
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
    updateTask: builder.mutation({
      query: (data) => {
        console.log(data, "<><><");
        return {
          url: `/${data.id}/`,
          method: "PUT",
          body: data.data,
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
  useTaskDetailsMutation,
  useTasksMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useMyTasksMutation,
} = taskApi;
