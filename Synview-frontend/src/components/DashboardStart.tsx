import React, { useEffect } from "react";
import { Tabs } from "@mantine/core";

import NewProject from "./NewProject.tsx";
import {
  useGetLocalUserByIdQuery,
  useGetMyProjectsQuery,
  useGetPayloadQuery,
  useGetReviewingProjectsQuery,
  useGetUserByIdQuery,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import NoProjects from "./HelperComponents/NoProjects.tsx";
import Project from "./Project.tsx";

import { connect } from "../services/webSocket.ts";
import { skipToken } from "@reduxjs/toolkit/query";
const wsurl = import.meta.env.VITE_WS_URL;

connect(wsurl);

export default function DashboardStart() {
  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  

  const { data, error, isLoading } = useGetMyProjectsQuery(UserData?.id ?? 0, {
    skip: !UserData?.id,
  });

  const { data: reviewingProjects, isLoading: isReviewingProjectsLoading } =
    useGetReviewingProjectsQuery(UserData?.id ?? 0, {
      skip: !UserData?.id,
    });
  const { isLoading: isInvitingUserLoading } = useGetUserByIdQuery(
    UserData?.id ?? skipToken
  );

  if (
    isLoading ||
    isUserLoading ||
    isReviewingProjectsLoading ||
    isInvitingUserLoading 
  ) {
    return <Loading />;
  }

  return (
    <div className=" justify-center items-center w-full p-10">
      <Tabs variant="outline" defaultValue="personalProjects">
        <Tabs.List>
          <Tabs.Tab value="personalProjects">My projects</Tabs.Tab>
          <Tabs.Tab value="messages">Reviewing projects</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="personalProjects">
          <div className="m-10 grid justify-center grid-cols-[repeat(auto-fill,_300px)] gap-10 ">
            <NewProject />
            {data &&
              data.map((project) => {
                return (
                  <div key={project.project_id}>
                    <Project {...project} />
                  </div>
                );
              })}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          <div className="m-10 grid justify-center grid-cols-[repeat(auto-fill,_300px)] gap-10 ">
            {reviewingProjects &&
              reviewingProjects.map((project) => {
                return (
                  <div key={project.project_id}>
                    <Project {...project} />
                  </div>
                );
              })}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
