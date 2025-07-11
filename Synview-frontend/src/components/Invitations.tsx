import React from "react";
import { Group, Avatar, Text } from "@mantine/core";
import type { Invitation } from "../../../common/types.ts";
export default function Invitations({
  role,
  invited_project_id,
  invited_user_id,
  status,
  invited_at,
}: Invitation) {
  return (
    <div>
      <Group gap="sm">
        <Avatar size={40} src={null} radius={40} />
        <div>
          <Text fz="sm" fw={500}>
            {invited_user_id}
          </Text>
          <Text fz="xs" c="dimmed">
            {invited_project_id}
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
      </Group>
    </div>
  );
}
