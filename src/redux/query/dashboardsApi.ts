import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { urls } from '@/constants/urls';
// import { URLS } from '../../constants/urls';


// Define a service using a base URL and expected endpoints
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  // 192.168.242.213
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.accessToken;
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
  
      adminDashboard: builder.mutation({
        query: ({admin , companyId , startDate , endDate}) => {
          return {
            url: `/admin/?companyId=${companyId || ''}&startDate=${startDate || ""}&endDate=${endDate || ''}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      userDashboard: builder.mutation({
        query: ({admin , companyId}) => {
          return {
            url: `/user/?companyId=${companyId || ''}`,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
     
   
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAdminDashboardMutation ,useUserDashboardMutation } = dashboardApi