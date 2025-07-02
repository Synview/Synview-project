import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EmailRegisterRequestSchema,
  EmailLoginRequestSchema,
  LoginResponse,
  UserInfo,
  Projects
} from "../../../common/types.ts";
const url = import.meta.env.VITE_URL;
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<void, EmailRegisterRequestSchema>({
      query: (newUser: EmailRegisterRequestSchema) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
    }),
    login: builder.mutation<LoginResponse, EmailLoginRequestSchema>({
      query: (User: EmailLoginRequestSchema) => ({
        url: "login",
        method: "POST",
        body: User,
      }),
    }),
    getMyProjects: builder.query<Projects, number>({
      query: (id) => `getMyProjects/${id}`,
    }),
    getPayload: builder.query<UserInfo, void>({
      query: () => "getPayload",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMyProjectsQuery,
  useGetPayloadQuery,
} = apiSlice;
