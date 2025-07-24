import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type EmailRegisterRequestSchema,
  type EmailLoginRequestSchema,
  type LoginResponse,
  type UserInfo,
  type Projects,
  type PostProject,
  type Project,
  type PostUpdate,
  type Question,
  type PostQuestion,
  type GithubInfo,
  type PostInvitaion,
  type UserData,
  type Update,
  type Invitation,
  type User,
} from "../../../common/types.ts";
import {
  connect,
  sendIsGone,
  sendIsPresent,
  subscribe,
} from "../services/webSocket.ts";
import { LogLevel, createLogger, rootLogger } from "../../../common/Logger.ts";
import type { RootState } from "../store.ts";
import { setUser } from "../slices/userSlice.ts";
import sleep from "../utils/sleep.ts";

const logger = createLogger("[Api Slice]", LogLevel.ERROR);

const url = import.meta.env.VITE_URL;
const wsurl = import.meta.env.VITE_WS_URL;
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    prepareHeaders: (headers) => {
      logger.info("PREPARE HEADERS RUNNING");
      const token = localStorage.getItem("token");
      if (token) {
        logger.info(token);
        headers.set("Authorization", `Bearer ${token}`);
        logger.info(`Token set in Authorization header`);
      } else {
        logger.warn("no token stored in local");
      }
      headers.set("X-Debug", `this works`);

      return headers;
    },
  }),
  tagTypes: [
    "Projects",
    "ReviewingProjects",
    "User",
    "Updates",
    "Questions",
    "Mentors",
    "Invitations",
    "CommitReview",
    "ProjectReview",
  ],
  endpoints: (builder) => ({
    getAiReviewJob: builder.query<
      { status: string; response: string; project_id: number },
      string
    >({
      query: (aiJobId) => `/projectAiReview/job/${aiJobId}`,
    }),
    getReviewingProjects: builder.query<Projects, number>({
      query: (id) => `reviewingProjects/${id}`,
      providesTags: ["ReviewingProjects"],
    }),
    getHasAccess: builder.query<
      boolean,
      { user_id: number; project_id: number }
    >({
      query: (arg) => {
        const { user_id, project_id } = arg;
        return {
          url: "getProjectWithAccess",
          params: { user_id, project_id },
        };
      },
    }),
    getPresence: builder.query<UserData[], string>({
      queryFn: () => ({ data: [] }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        id,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        await connect(wsurl);
        await cacheDataLoaded;
        let currUser = (getState() as RootState).user;

        while (true) {
          currUser = (getState() as RootState).user;
          if (currUser.user_id !== 0) break;
          await sleep(100);
        }
        rootLogger.info(currUser.email);

        sendIsPresent(`Presence:${id}`, currUser);
        const unsubscribe = subscribe(
          `Presence:${id}`,
          (data: { present: UserData[] }) => {
            updateCachedData(() => {
              return data.present;
            });
          }
        );

        await cacheEntryRemoved;
        sendIsGone(`Presence:${id}`);
        unsubscribe();
      },
    }),
    getLocalUserById: builder.query<User, number>({
      query: (id) => `getUser/${id}`,
      async onQueryStarted(_id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          logger.error("Couldn't get user data");
        }
      },
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `getUser/${id}`,
    }),
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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getMyProjects: builder.query<Projects, number>({
      query: (id) => `getMyProjects/${id}`,
      providesTags: ["Projects"],
    }),

    getProjectById: builder.query<Project, number>({
      query: (id) => `getProject/${id}`,
      providesTags: ["ProjectReview"],
    }),
    postProject: builder.mutation<void, PostProject>({
      query: (Project: PostProject) => ({
        url: "postProject",
        method: "POST",
        body: Project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getMyUpdates: builder.query<Update[], string>({
      query: (id) => `getMyUpdates/${id}`,
      async onCacheEntryAdded(
        id,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        connect(wsurl);
        await cacheDataLoaded;

        const unsubscribe = subscribe(`Updates:${id}`, (newMessage: Update) => {
          updateCachedData((draft) => {
            draft.push(newMessage);
          });
        });

        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ["Updates"],
    }),
    getUpdateById: builder.query<Update, number>({
      query: (id) => `getUpdateById/${id}`,
      providesTags: ["Updates", "CommitReview"],
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
        id,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        connect(wsurl);
        await cacheDataLoaded;

        const unsubscribe = subscribe(
          `UpdateQuestions:${id}`,
          (newMessage: Question) => {
            updateCachedData((draft) => {
              draft.push(newMessage);
            });
          }
        );

        await cacheEntryRemoved;
        unsubscribe();
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
    getCommitData: builder.query<
      { files: { name: string; content: string }[]; diffs: string },
      { user: string; repo: string; sha: string }
    >({
      query: (arg) => {
        const { user, repo, sha } = arg;
        return {
          url: "getCommitData",
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
      invalidatesTags: ["Invitations"],
    }),
    getMentors: builder.query<UserData[], number>({
      query: (id) => `getMentors/${id}`,
      providesTags: ["Mentors"],
    }),
    getInvitations: builder.query<Invitation[], number>({
      query: (id) => `getInvitations/${id}`,
      providesTags: ["Invitations"],
    }),
    acceptInvitation: builder.mutation<void, Invitation>({
      query: (Invite: Invitation) => ({
        url: "acceptInvitations",
        method: "PUT",
        body: Invite,
      }),
    }),
    projectReview: builder.mutation<{aiJobId: string, status: string}, number>({
      query: (id: number) => ({ url: `projectAiReview/${id}`, method: "POST" }),
      invalidatesTags: ["ProjectReview"],
    }),
    commitReview: builder.mutation<string, number>({
      query: (id: number) => ({
        url: `commitAiReview/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["CommitReview"],
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
  useGetCommitDataQuery,
  useGetUpdateByIdQuery,
  useLogoutMutation,
  useGetInvitationsQuery,
  useGetUserByIdQuery,
  useAcceptInvitationMutation,
  useGetPresenceQuery,
  useProjectReviewMutation,
  useCommitReviewMutation,
  useGetHasAccessQuery,
  useGetReviewingProjectsQuery,
  useGetLocalUserByIdQuery,
  useGetAiReviewJobQuery
} = apiSlice;
