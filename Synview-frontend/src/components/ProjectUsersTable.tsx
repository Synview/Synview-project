import { Avatar, Badge, Group, Select, Table, Text } from "@mantine/core";
import React from "react";
import {
  useGetMentorsQuery,
  useGetPayloadQuery,
  useGetPresenceQuery,
} from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound.tsx";
import Loading from "./HelperComponents/Loading.tsx";
import { useGetUserByIdQuery } from "../services/apiSlice.ts";
import { skipToken } from "@reduxjs/toolkit/query";

export default function ProjectUsersTable() {
  const { id } = useParams();
  if (!id) {
    return <NotFound />;
  }

  const { data: userPayload, isLoading: isUserPayloadLoading } =
    useGetPayloadQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useGetUserByIdQuery(userPayload?.id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const { data: presentUsers, isLoading: isPresenceLoading } =
    useGetPresenceQuery(id);
  const { data: mentorsData, isLoading: mentorsLoading } = useGetMentorsQuery(
    parseInt(id)
  );
  if (
    mentorsLoading ||
    isPresenceLoading ||
    isUserLoading ||
    isUserPayloadLoading
  ) {
    return <Loading />;
  }
  const rows = mentorsData?.map((mentor) => (
    <Table.Tr key={mentor.username}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={null} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {mentor.username}
            </Text>
            <Text fz="xs" c="dimmed">
              {mentor.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>{mentor.user_id}</Table.Td>
      <Table.Td>
        {presentUsers?.some((u) => u.user_id === mentor.user_id) ? (
          <Badge fullWidth variant="light">
            Active
          </Badge>
        ) : (
          <Badge color="gray" fullWidth variant="light">
            Disabled
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Id</Table.Th>
              <Table.Th>Active</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
}
