import React from "react";
import { useParams } from "react-router-dom";
import { useGetPayloadQuery } from "../services/apiSlice.ts";
import {
  closeGithubModal,
  openGithubModal,
} from "../slices/syncGithubModalSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import { Modal } from "@mantine/core";
import NotFound from "./NotFound.tsx";
import SyncForm from "./SyncForm.tsx";
export default function ProjectViewInfo() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.githubModal.isOpen);

  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (!id) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col p-10 bg-neutral-900">
      <div className="flex flex-row justify-between w-full gap-10">
        <h1>{UserData?.username}</h1>
        <div className="flex items-center">
          <button
            type="button"
            className="btn"
            onClick={() =>
              dispatch(
                openGithubModal({
                  project_id: parseInt(id),
                  user_id: UserData?.id,
                  isOpen: true,
                })
              )
            }
          >
            Sync commits
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-10">
        <h1> Mentors </h1>
        <button className="btn">Invite a mentor</button>
      </div>
      <Modal
        opened={open}
        onClose={() => dispatch(closeGithubModal())}
        title="Enter your info"
        centered
      >
        <SyncForm/>
      </Modal>
    </div>
  );
}
