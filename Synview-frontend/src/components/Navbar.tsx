import React from "react";
import NavbarDropdown from "./NavbarDropdown.tsx";
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
    <div className="navbar bg-neutral-800 p-4">
      <div className="navbar-start">
        <Drawer />
      </div>
      <div className="navbar-end gap-10">
        <p>{data?.username}</p>
        <NavbarDropdown />
      </div>
    </div>
  );
}
