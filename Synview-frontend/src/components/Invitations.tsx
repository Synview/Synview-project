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
    isLoading: isInvitingUserLoading,
    error: invitingUserError,
  } = useGetUserByIdQuery(inviting_user_id ?? skipToken);
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetProjectByIdQuery(invited_project_id ?? skipToken);
  if (isInvitingUserLoading || isProjectLoading) {
    return;
  }

  if (!project?.project_id) {
    return <NotFound />;
  }

  if (projectError || invitingUserError) {
    return <div>Error getting the data</div>;
  }

  const acceptInvitation = async () => {
    await acceptInv({
      role: role,
      invited_user_id: invited_user_id,
      inviting_user_id: inviting_user_id,
      invited_project_id: project?.project_id,
      project_invitation_id: project_invitation_id,
    });
  };

  return (
    <div className="animation-fade-up">
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
            {invited_at && new Date(invited_at).toLocaleDateString()}
          </Text>
        </div>
        <div>
          {status === "PENDING" && (
            <Button variant="default" onClick={acceptInvitation}>
              Accept
            </Button>
          )}
        </div>
      </Group>
    </div>
  );
}
