import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage for web)
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

// Custom storage for Next.js to handle SSR
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storageEngine = typeof window !== "undefined" ? storage : createNoopStorage();

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage: storageEngine, // Use custom storage engine
  whitelist: ["user"], // Persist only the user slice
  blacklist: [
    authApi.reducerPath,
    employeeApi.reducerPath,
    companiesApi.reducerPath,
    timeSheetApi.reducerPath,
    clientsApi.reducerPath,
    RFQSApi.reducerPath,
    jobApi.reducerPath,
    paymentApi.reducerPath,
    expensesApi.reducerPath,
    accountsApi.reducerPath,
    subcontractorApi.reducerPath,
    taskApi.reducerPath,
    transactionApi.reducerPath,
    dashboardApi.reducerPath,
  ], // Blacklist RTK Query API reducers
};

// Combine reducers
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

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to prevent serialization errors
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/REGISTER", // Added REGISTER to suppress warning
        ],
      },
    }).concat([
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
      dashboardApi.middleware,
    ]),
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export persistor
export const persistor = persistStore(store);