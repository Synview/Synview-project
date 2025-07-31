import { useParams } from "react-router-dom";
import "../css/ButtonAi.css";
import {
  useGetAiReviewJobQuery,
  useProjectReviewMutation,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import NotFound from "./NotFound.tsx";
import { skipToken } from "@reduxjs/toolkit/query";
import { rootLogger } from "../../../common/Logger.ts";
import { Tooltip } from "@mantine/core";

export default function AIButton() {
  const { id } = useParams();
  if (!id) {
    return <NotFound />;
  }
  const [
    projectReview,
    { data: projectReviewData, isLoading: isProjectReviewLoading },
  ] = useProjectReviewMutation();
  const { data: aiReviewQueryData, isLoading: isAiReviewQueryLoading } =
    useGetAiReviewJobQuery(projectReviewData?.aiJobId ?? skipToken, {
      pollingInterval: 10000,
    });

  if (isProjectReviewLoading || isAiReviewQueryLoading) {
    return <Loading />;
  }
  const summarizeProjectAI = async () => {
    if (!id) {
      rootLogger.error("No project id");
      return;
    }
    await projectReview(Number(id));
  };

  if (aiReviewQueryData?.status === "started") {
    return (
      <>
        <button  type="button" className="Button loadingButton" aria-label="Loading, please wait">
          <img src="/star.svg" className="spin-animation" alt="Loading animation"></img>
        </button>
      </>
    );
  }
  return (
    <Tooltip label="Refresh for changes">
    
      <button
        type="button"
        className="Button normalButton"
        onClick={summarizeProjectAI}
      >
        Summarize
      </button>
    </Tooltip>
  );
}
