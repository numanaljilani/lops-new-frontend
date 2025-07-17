import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/project`,    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }, }),
  endpoints: (builder) => ({
    jobs: builder.mutation({
      query: ({page , search , companyId , startDate , endDate}) => {
        return {
          url: `/?page=${page || 1 }&search=${search || ''}&companyId=${companyId || ''}&startDate=${startDate || ''}&endDate=${endDate || ''}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createJob: builder.mutation({
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
    deleteJobCard: builder.mutation({
      query: ({data , id }) => {
        console.log("delet client ", data);
        return {
          url: `/${id}`,
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
          url: `/${data.id}/`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: `bearer ${data.token}`,
          },
        };
      },
    }),
    updateProject: builder.mutation({
      query: ({data , id}) => {
        return {
          url: `/${id}/`,
          method: "PUT",
          body: data,
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
  useJobDetailsMutation,
  useJobsMutation,
  useCreateJobMutation,
  useDeleteJobCardMutation,
  useUpdateProjectMutation,
} = jobApi;
