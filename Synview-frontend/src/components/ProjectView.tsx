import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";

import ProjectViewInfo from "./ProjectViewInfo.tsx";
import ProjectViewUpdates from "./ProjectViewUpdates.tsx";
import { Modal } from "@mantine/core";
import { useAppSelector, useAppDispatch } from "../hooks.ts";
import { closeQuestionModal } from "../slices/questionModalSlice.ts";
import UpdateModalContent from "./UpdateModalContent.tsx";

export default function ProjectView() {
  const { id } = useParams();
  const open = useAppSelector((state) => state.questionModal.isOpen);
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <h1>This is not your proyect!</h1>;
  }

  return (
    <div className="overflow-y-hidden">
      <div className="flex h-full flex-row card bg-neutral-900 shadow-sm overflow-y-scroll">
        <ProjectViewUpdates />
        <ProjectViewInfo />
      </div>
      <Modal
        opened={open}
        onClose={() => dispatch(closeQuestionModal())}
        title=""
        centered
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <UpdateModalContent />
      </Modal>
    </div>
  );
}
