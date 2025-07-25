import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice.ts";
import questionModalReducer from "./slices/questionModalSlice.ts";
import githubModalReducer from "./slices/syncGithubModalSlice.ts";
import inviteMentorReducer from "./slices/inviteMentorModalSlice.ts";
import userReducer from "./slices/userSlice.ts";
import drawerReducer from "./slices/drawerSlice.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    questionModal: questionModalReducer,
    githubModal: githubModalReducer,
    inviteMentorModal: inviteMentorReducer,
    drawer: drawerReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
