import React from "react";
import NoPermission from "./HelperComponents/NoPermission.tsx";
import {
  useGetHasAccessQuery,
  useGetPayloadQuery,
  useGetProjectByIdQuery,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
type Props = {
  children: React.JSX.Element;
};

export default function WithRole({ children }: Props) {
  const { id } = useParams();

  const { data: userData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: projectData, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(parseInt(id) ?? "", {
      skip: !id,
    });

  const args =
    userData?.id && projectData?.owner_id
      ? {
          user_id: userData?.id,
          project_id: projectData?.project_id,
        }
      : skipToken;

  const { data: hasAccess, isLoading: isHasAccessLoading } =
    useGetHasAccessQuery(args);

  if (isUserLoading || isProjectLoading || isHasAccessLoading) {
    return <Loading />;
  }

  if (!hasAccess) {
    return <NoPermission />;
  }
  return children;
}
