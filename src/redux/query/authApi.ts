import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { urls } from '@/constants/urls';
// import { URLS } from '../../constants/urls';


// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  // 192.168.242.213
  baseQuery: fetchBaseQuery({ baseUrl: `${urls.server}auth/`}),
  endpoints: (builder) => ({
  
      login: builder.mutation({
        query: (user) => {
          return {
            url: "login",
            method: "POST",
            body: user,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          };
        },
      }),
      me: builder.mutation({
        query: (token) => {
          return {
            url: "me",
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              authorization: `bearer ${token}`,
            },
          };
        },
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation ,useMeMutation } = authApi