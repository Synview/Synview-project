import React, { use } from "react";
import { useEffect, useState } from "react";
import { getPayload } from "../services/apiHandler.ts";
import { useAppSelector, useAppDispatch } from "../hooks.ts";
import { addUser } from "../slices/userSlice.ts";
import { addProject } from "../slices/projectSlice.ts";
import NewProject from "./NewProject.tsx";
import type { Project as ProjectType } from "../../../common/types.ts";
import {
  useGetMyProjectsQuery,
  useGetPayloadQuery,
} from "../services/apiSlice.ts";

import NoProjects from "./NotFound/NoProjects.tsx";
import Project from "./Project.tsx";
export default function DashboardStart() {
  const { data: UserData , isLoading: isUserLoading} = useGetPayloadQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const { data, error, isLoading } = useGetMyProjectsQuery(UserData?.id ?? 0, {
    skip: !UserData?.id,
  });

  if(isLoading){return <div>perate</div>}

  console.log(data)
  
  return (
    <div className=" justify-center items-center w-full p-10">
      <div className="grid justify-center grid-cols-[repeat(auto-fill,_300px)] gap-10 ">
        <NewProject />

        {data ? (
          data.map((project) => {
            return (
              <div key={project.ProjectId}>
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
