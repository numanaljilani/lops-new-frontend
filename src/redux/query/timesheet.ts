import { urls } from "@/constants/urls";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const timeSheetApi = createApi({
  reducerPath: "timeSheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${urls.server}/timesheet`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
   
  endpoints: (builder) => ({
    timesheet: builder.mutation({
      query: ({projectId, admin}) => {
        return {
          url: `/?projectId=${projectId ||''}&admin=${admin || ''}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createTimeSheet: builder.mutation({
      query: (data) => {
        console.log(data);
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
    deleteTimesheet: builder.mutation({
      query: ({id}) => {
        return {
          url: `/${id}/`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
       
          },
        };
      },
    }),
    timeSheetDetails: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
        };
      },
    }),
    patchEmployee: builder.mutation({
      query: (data) => {
        return {
          url: `employees/${data.id}/`,
          method: "Patch",
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
  useDeleteTimesheetMutation,
  useTimesheetMutation,
  useCreateTimeSheetMutation,
  useTimeSheetDetailsMutation,
  usePatchEmployeeMutation,
} = timeSheetApi;
