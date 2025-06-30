import React from "react";
import { useEffect, useState } from "react";
import { getPayload, getMyProjects } from "../Api_handler.ts";
import { z } from "zod";
import { useAppSelector, useAppDispatch } from "../hooks.ts";
import { addUser } from "../slices/userSlice.ts";
import { addProject } from "../slices/projectSlice.ts";
import NoProjects from "./NotFound/NoProjects.tsx";
import Project from "./Project.tsx";
export default function DashboardStart() {
  const [loaded, setLoaded] = useState(false);

  interface Project {
    ProjectId: number;
    title: string;
    description: string;
    owner_id: number;
    repo_url: string;
    doc_url: string;
    created_at: Date;
  }
  type UserInfo = z.infer<typeof UserInfoSchema>;
  const UserInfoSchema = z.object({
    username: z.string(),
    role: z.string(),
    id: z.number(),
  });

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const projects = useAppSelector((state) => state.project);
  const getUserInfo = async () => {
    const a: UserInfo = await getPayload();
    try {
      if (!a) {
        throw new Error("no payload");
      }
      dispatch(addUser(a));
    } catch (error) {
      throw new Error("error" + error);
    }
    return a;
  };
  const getProjects = async (id: number) => {
    const MyProjects = await getMyProjects(id);
    MyProjects.map((project: Project) => {
      dispatch(addProject(project));
    });
  };

  const getDashboardData = async () => {
    const userInfo = await getUserInfo();
    await getProjects(userInfo.id);
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) {
      getDashboardData();
    }
  }, []);

  console.log(projects.projects);

  return (
    <div className=" justify-center items-center w-full p-10">
      <div className="grid justify-center grid-cols-[repeat(auto-fill,_300px)] gap-10 ">
        {projects ? (
          projects.projects.map((project) => {
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
