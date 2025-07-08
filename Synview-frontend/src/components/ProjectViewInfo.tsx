import React from "react";
import { useParams } from "react-router-dom";
import { useGetPayloadQuery } from "../services/apiSlice.ts";
export default function ProjectViewInfo() {
  const { id } = useParams();
  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  return (
    <div className="flex flex-col p-10 bg-neutral-900">
      <div className="flex flex-row justify-between w-full gap-10">
        <h1>{UserData?.username}</h1>
        <div className="flex items-center">
          <button className="btn">Sync commits</button>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-10">
        <h1> Mentors </h1>
        <button className="btn">Invite a mentor</button>
      </div>
    </div>
  );
}
