import React from "react";
import { useAppSelector } from "../hooks.ts";
import {
  useGetPayloadQuery,
  useGetProjectByIdQuery,
} from "../services/apiSlice.ts";
import Drawer from "./Drawer.tsx";
import { useParams } from "react-router-dom";
export default function Navbar() {
  const { data, error, isLoading } = useGetPayloadQuery();
  const { id } = useParams();

  const { data: ProjectData } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });

  return (
    <div className="navbar z-1000 bg-neutral-800 p-4">
      <div className="navbar-start">
        <Drawer />
        <h4 className="pl-20">{id && ProjectData?.title}</h4>
      </div>
      <div className="navbar-end">
        <p>{data?.username}</p>
      </div>
    </div>
  );
}
