import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "./slice/profileSlice";

import { authApi } from "./query/authApi";
import { employeeApi } from "./query/employee";
import { companiesApi } from "./query/componiesApi";
import { timeSheetApi } from "./query/timesheet";
import { clientsApi } from "./query/clientsApi";
import { RFQSApi } from "./query/rfqsApi";
import { jobApi } from "./query/jobApi";
import { paymentApi } from "./query/paymentApi";
import { expensesApi } from "./query/expensesApi";
import { accountsApi } from "./query/accountsApi";
import { subcontractorApi } from "./query/subcontractor";
import { taskApi } from "./query/taskApi";
import { transactionApi } from "./query/transactionApi";
import { dashboardApi } from "./query/dashboardsApi";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
   whitelist: ['user'],
};
const reducer = combineReducers({
  user: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [companiesApi.reducerPath]: companiesApi.reducer,
  [timeSheetApi.reducerPath]: timeSheetApi.reducer,
  [clientsApi.reducerPath]: clientsApi.reducer,
  [RFQSApi.reducerPath]: RFQSApi.reducer,
  [jobApi.reducerPath]: jobApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [expensesApi.reducerPath]: expensesApi.reducer,
  [accountsApi.reducerPath]: accountsApi.reducer,
  [subcontractorApi.reducerPath]: subcontractorApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Add the generated reducer as a specific top-level slice

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      employeeApi.middleware,
      companiesApi.middleware,
      timeSheetApi.middleware,
      clientsApi.middleware,
      RFQSApi.middleware,
      jobApi.middleware,
      paymentApi.middleware,
      expensesApi.middleware,
      accountsApi.middleware,
      subcontractorApi.middleware,
      taskApi.middleware,
      transactionApi.middleware,
      dashboardApi.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
export const persistor = persistStore(store); // Add this line
