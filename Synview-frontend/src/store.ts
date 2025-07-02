import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import projectReducer from "./slices/projectSlice.ts";
import { apiSlice } from "./services/apiSlice.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    project: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
