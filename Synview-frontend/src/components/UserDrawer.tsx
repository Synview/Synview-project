 

import { useAppDispatch, useAppSelector } from "../hooks.ts";
import { Button, Drawer, Stack, Tree, Indicator } from "@mantine/core";
import { Burger } from "@mantine/core";

import { Link } from "react-router-dom";
import { closeDrawer, openDrawer } from "../slices/drawerSlice.ts";
import {
  useGetInvitationsQuery,
  useGetPayloadQuery,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import Invitations from "./Invitations.tsx";
import { skipToken } from "@reduxjs/toolkit/query";

export default function UserDrawer() {
  const { data: userData, isLoading: userLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: invitations, isLoading: invitationsLoading } =
    useGetInvitationsQuery(userData?.id ?? skipToken);

  const dispatch = useAppDispatch();
  const opened = useAppSelector((state) => state.drawer.isOpen);
  if (userLoading || invitationsLoading) {
    return <Loading />;
  }

  const pending = invitations?.filter((inv) => inv.status === "PENDING") || [];

  const data = [
    {
      value: "",
      label: (
        <Indicator
          withBorder
          size={22}
          label={`${pending.length > 0 ? pending?.length : 0}`}
          processing={pending.length > 0 ? pending?.length > 0 : false}
        >
          <Button variant="default" fullWidth>
            Invitations
          </Button>
        </Indicator>
      ),
      children: [
        {
          value: "stack",
          label: (
            <Stack
              className="pt-4"
              h={100}
              bg="var(--mantine-color-body)"
              align="stretch"
              justify="flex-stretch"
              gap="md"
            >
              {invitations?.map((invitation) => (
                <Invitations
                  key={invitation.project_invitation_id}
                  {...invitation}
                />
              ))}
            </Stack>
          ),
        },
      ],
    },
  ];
  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => {
          dispatch(closeDrawer());
        }}
        title="Menu"
        variant="default"
        color="dark"
      >
        <Stack
          h={300}
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="flex-start"
          gap="md"
        >
          <Button variant="default" component={Link} to="/dashboard">
            Go to dashboard
          </Button>

          <Tree data={data} />
        </Stack>
      </Drawer>

      <Burger
        color="#ffffff"
        opened={opened}
        onClick={() => {
          dispatch(openDrawer());
        }}
      />
    </>
  );
}
