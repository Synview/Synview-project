import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import ProjectViewInfo from "./ProjectViewInfo.tsx";
import ProjectViewUpdates from "./ProjectViewUpdates.tsx";
export default function ProjectView() {
  const { id } = useParams();

  const { data, error, isLoading } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <h1>This is not your proyect!</h1>;
  }

  return (
    <div className="flex h-full flex-row card bg-neutral-900 shadow-sm">
      <ProjectViewUpdates />

      <ProjectViewInfo />
    </div>
  );
}
