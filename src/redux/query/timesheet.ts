import { urls } from '@/constants/urls';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



// Define a service using a base URL and expected endpoints
export const timeSheetApi = createApi({
  reducerPath: 'timeSheetApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/api/v1/` }),
  endpoints: (builder) => ({
    timesheet: builder.mutation({
        query: (data) => {
          return {
            url: `timesheets/?${'job_car='+data?.job_car || ''}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
    createTimeSheet: builder.mutation({
        query: (data) => {
            console.log(data)
          return {
            url: "timesheets/",
            method: "POST",
            body: data.data,
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
      timeSheetDetails: builder.mutation({
        query: (data) => {
          return {
            url: `timesheets/${data.id}/`,
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
            method: "Patch",
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
export const { useDeleteEmployeeMutation , useTimesheetMutation ,useCreateTimeSheetMutation , useTimeSheetDetailsMutation , usePatchEmployeeMutation} = timeSheetApi