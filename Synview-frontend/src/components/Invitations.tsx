import React from "react";
import { Group, Avatar, Text, Button } from "@mantine/core";
import type { Invitation } from "../../../common/types.ts";
import {
  useGetProjectByIdQuery,
  useGetUserByIdQuery,
  useAcceptInvitationMutation,
} from "../services/apiSlice.ts";
import { skipToken } from "@reduxjs/toolkit/query";
import Loading from "./HelperComponents/Loading.tsx";
import NotFound from "./HelperComponents/NotFound.tsx";

export default function Invitations({
  project_invitation_id,
  role,
  invited_project_id,
  invited_user_id,
  status,
  invited_at,
  inviting_user_id,
}: Invitation) {
  const [acceptInv] = useAcceptInvitationMutation();

  const {
    data: invitingUser,
    error: invitingUserError,
    isLoading: isInvitingUserLoading,
  } = useGetUserByIdQuery(inviting_user_id ?? skipToken);
  const {
    data: project,
    error: projectError,
    isLoading: isProjectLoading,
  } = useGetProjectByIdQuery(invited_project_id ?? skipToken);
  
  if (isInvitingUserLoading || isProjectLoading) {
    return <Loading />;
  }

  if(!project?.project_id){
    return <NotFound/>
  }

  const acceptInvitation = async () => {
    await acceptInv ({
      role : role,
      invited_user_id : invited_user_id,
      inviting_user_id: inviting_user_id,
      invited_project_id : project?.project_id,
      project_invitation_id : project_invitation_id
    })
  };

  return (
    <div>
      <Group gap="md">
        <Avatar size={40} src={null} radius={40} />
        <div>
          <Text fz="sm" fw={500}>
            {invitingUser?.username}
          </Text>
          <Text fz="xs" c="dimmed">
            {project?.title}
          </Text>
        </div>
        <div>
          <Text fz="sm" fw={500}>
            {status}
          </Text>
          <Text fz="sm" fw={500}>
            {invited_at && new Date(invited_at).getTime()}
          </Text>
        </div>
        <div>
          <Button variant="default" onClick={acceptInvitation}>Accept</Button>
        </div>
      </Group>
    </div>
  );
}
