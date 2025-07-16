import React, { useEffect } from "react";

import NewProject from "./NewProject.tsx";
import {
  useGetMyProjectsQuery,
  useGetPayloadQuery,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import NoProjects from "./HelperComponents/NoProjects.tsx";
import Project from "./Project.tsx";

import { connect } from "../services/webSocket.ts";
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

  if (isLoading || isUserLoading) {
    return <Loading />;
  }
  return (
    <div className=" justify-center items-center w-full p-10">
      <div className="grid justify-center grid-cols-[repeat(auto-fill,_300px)] gap-10 ">
        <NewProject />

        {data ? (
          data.map((project) => {
            return (
              <div key={project.project_id}>
                <Project {...project} />
              </div>
            );
          })
        ) : (
          <NoProjects />
        )}
      </div>
    </div>
  );
}
