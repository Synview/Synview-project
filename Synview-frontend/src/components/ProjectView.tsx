import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";

import ProjectViewInfo from "./ProjectViewInfo.tsx";
import ProjectViewUpdates from "./ProjectViewUpdates.tsx";
import { Modal } from "@mantine/core";
import { useAppSelector, useAppDispatch } from "../hooks.ts";
import { closeQuestionModal } from "../slices/questionModalSlice.ts";
import UpdateModalContent from "./UpdateModalContent.tsx";
import NotFound from "./NotFound.tsx";
import { skipToken } from "@reduxjs/toolkit/query";

export default function ProjectView() {
  const { id } = useParams();
  const open = useAppSelector((state) => state.questionModal.isOpen);
  const dispatch = useAppDispatch();

  if (!id) {
    return <NotFound/>;
  }
  const { data, isLoading } = useGetProjectByIdQuery(
    parseInt(id) ?? skipToken
  );


  if (isLoading) {
    return <Loading />;
  }
  if (!data) {
    return <h1>Something wrong happened</h1>;
  }

  

  return (
    <div className="overflow-y-hidden">
      <div className="flex h-full flex-row card bg-neutral-900 shadow-sm overflow-y-scroll">
        <div className="flex-1 h-full overflow-y-scroll border-r border-t border-neutral-600">
          <ProjectViewUpdates />
        </div>
        <div className="flex-1 h-full overflow-y-scroll border-t border-neutral-600">
          <ProjectViewInfo />
        </div>
      </div>
      <Modal
        opened={open}
        onClose={() => dispatch(closeQuestionModal())}
        centered
        fullScreen
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
        styles={{
          body: {
            padding: 0,
            scrollbarWidth: "none",
          },
          header : {
            backgroundColor : "black",
            color: "white"
          }
        }}
      >
        <UpdateModalContent />
      </Modal>
    </div>
  );
}
