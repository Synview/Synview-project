import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetPayloadQuery,
  useGetProjectByIdQuery,
  useProjectReviewMutation,
} from "../services/apiSlice.ts";
import {
  closeGithubModal,
  openGithubModal,
} from "../slices/syncGithubModalSlice.ts";
import {
  closeInviteMentorModal,
  openInviteMentorModal,
} from "../slices/inviteMentorModalSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import { Button, Modal } from "@mantine/core";
import NotFound from "./NotFound.tsx";
import SyncForm from "./SyncForm.tsx";
import MentorInviteForm from "./MentorInviteForm.tsx";
import Loading from "./HelperComponents/Loading.tsx";
import ProjectUsersTable from "./ProjectUsersTable.tsx";
import { rootLogger } from "../../../common/Logger.ts";
import ProjectSummarizeAI from "./ProjectSummarizeAI.tsx";
export default function ProjectViewInfo() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const githubOpen = useAppSelector((state) => state.githubModal.isOpen);
  const inviteOpen = useAppSelector((state) => state.inviteMentorModal.isOpen);

  if (!id) {
    return <NotFound />;
  }

  const { data: projectData, isLoading: isProjectDataLoading } =
    useGetProjectByIdQuery(parseInt(id));
  const { data: userData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [projectReview, { isLoading: isProjectReviewLoading }] =
    useProjectReviewMutation();

  if (isUserLoading || isProjectDataLoading) {
    return <Loading />;
  }

  const summarizeProjectAI = async () => {
    if (!id) {
      rootLogger.error("No project id");
      return;
    }
    await projectReview(id);
  };

  return (
    <div className="flex flex-col p-10 bg-neutral-900 text-white">
      <div className="flex flex-row justify-between w-full gap-10">
        <h1>{projectData?.title} - </h1>
        <div className="flex items-center">
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (!userData?.id) return;
              dispatch(
                openGithubModal({
                  project_id: parseInt(id),
                  user_id: userData.id,
                  isOpen: true,
                })
              );
            }}
          >
            Sync commits
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center gap-10">
        <div className="flex flex-row w-full justify-between items-center gap-10">
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (!userData?.id) return;
              dispatch(
                openInviteMentorModal({
                  project_id: parseInt(id),
                  user_id: userData.id,
                  isOpen: true,
                })
              );
            }}
          >
            Invite a mentor
          </button>
          <ProjectUsersTable />
        </div>
        <div className="flex w-full flex-col">
          <Button className=""onClick={summarizeProjectAI} loading={isProjectReviewLoading}>
            Summarize
          </Button>
          <ProjectSummarizeAI />
        </div>
      </div>
      <Modal
        opened={githubOpen}
        onClose={() => dispatch(closeGithubModal())}
        title="Enter your info"
        centered
        classNames={{
          header: "text-black",
          content: "bg-stone-900 text-white",
        }}
      >
        <SyncForm />
      </Modal>
      <Modal
        opened={inviteOpen}
        onClose={() => dispatch(closeInviteMentorModal())}
        title="Search for a mentor!"
        centered
        classNames={{
          header: "text-black bg-stone-900",
          content: "bg-stone-900 text-white",
        }}
      >
        <MentorInviteForm />
      </Modal>
    </div>
  );
}
