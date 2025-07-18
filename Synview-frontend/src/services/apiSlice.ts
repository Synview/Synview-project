import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type EmailRegisterRequestSchema,
  type EmailLoginRequestSchema,
  type LoginResponse,
  type UserInfo,
  type Projects,
  type PostProject,
  type Project,
  type Updates,
  type PostUpdate,
  type Question,
  type PostQuestion,
  type GithubInfo,
  type PostInvitaion,
  type UserData,
  type Update
} from "../../../common/types.ts";
import {
  PostQuestionSchema,
  PostUpdateSchema,
} from "../../../common/schemas.ts";
const url = import.meta.env.VITE_URL;
const wsurl = import.meta.env.VITE_WS_URL;
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
  }),
  tagTypes: ["Projects", "User", "Updates", "Questions", "Mentors"],
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
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `getProject/${id}`,
    }),
    postProject: builder.mutation<void, PostProject>({
      query: (Project: PostProject) => ({
        url: "postProject",
        method: "POST",
        body: Project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getMyUpdates: builder.query<Updates, string>({
      query: (id) => `getMyUpdates/${id}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket(wsurl);
        try {
          await cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (!PostUpdateSchema.safeParse(data).success) {
              throw new Error("Schema didnt validate correctly");
            }
            updateCachedData((draft) => {
              draft.push(data);
            });
          };
          ws.addEventListener("message", listener);
        } catch {
          throw new Error("Couldnt update updates trough websocket");
        }
        await cacheEntryRemoved;
        ws.close();
      },
      providesTags: ["Updates"],
    }),
    getUpdateById: builder.query<Update, number>({
      query: (id) => `getUpdateById/${id}`,
      providesTags: ["Updates"]
    }),
    postUpdate: builder.mutation<void, PostUpdate>({
      query: (Update: PostUpdate) => ({
        url: "postUpdate",
        method: "POST",
        body: Update,
      }),
      invalidatesTags: ["Updates"],
    }),
    getPayload: builder.query<UserInfo, void>({
      query: () => "getPayload",
    }),
    getUpdateQuestions: builder.query<Question[], number>({
      query: (id) => `getUpdateQuestions/${id}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket(wsurl);
        try {
          await cacheDataLoaded;
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (!PostQuestionSchema.safeParse(data).success) {
              throw new Error("Schema didnt validate correctly");
            }
            updateCachedData((draft) => {
              draft.push(data);
            });
          };
          ws.addEventListener("message", listener);
        } catch {
          throw new Error("Couldnt update questions trough websocket");
        }
        await cacheEntryRemoved;
        ws.close();
      },
      providesTags: ["Questions"],
    }),
    postQuestion: builder.mutation<void, PostQuestion>({
      query: (Question: PostQuestion) => ({
        url: "postQuestion",
        method: "POST",
        body: Question,
      }),
      invalidatesTags: ["Questions"],
    }),
    getMyCommits: builder.mutation<void, GithubInfo>({
      query: (GitInfo: GithubInfo) => ({
        url: "syncCommits",
        method: "POST",
        body: GitInfo,
      }),
    }),
    getFiles: builder.query<{name:string, content:string }[], { user: string; repo: string; sha: string }>({
      query: (arg) => {
        const { user, repo, sha } = arg;
        return {
          url: "getCommitFiles",
          params: { user, repo, sha },
        };
      },
    }),
    inviteMentor: builder.mutation<void, PostInvitaion>({
      query: (InvitationInfo: PostInvitaion) => ({
        url: "inviteUser",
        method: "POST",
        body: InvitationInfo,
      }),
    }),
    getMentors: builder.query<UserData[], number>({
      query: (id) => `getMentors/${id}`,
      providesTags: ["Mentors"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMyProjectsQuery,
  useGetPayloadQuery,
  usePostProjectMutation,
  useGetProjectByIdQuery,
  useGetMyUpdatesQuery,
  usePostUpdateMutation,
  useGetUpdateQuestionsQuery,
  usePostQuestionMutation,
  useGetMyCommitsMutation,
  useInviteMentorMutation,
  useGetMentorsQuery,
  useGetFilesQuery,
  useGetUpdateByIdQuery,
} = apiSlice;
