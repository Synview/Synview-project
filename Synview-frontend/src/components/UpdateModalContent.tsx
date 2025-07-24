import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAppSelector } from "../hooks.ts";
import {
  useGetCommitDataQuery,
  useGetProjectByIdQuery,
  useGetUpdateByIdQuery,
  useCommitReviewMutation,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound.tsx";
import SummarizeAI from "./SummarizeAI.tsx";
import { Button, Kbd } from "@mantine/core";
import { rootLogger } from "../../../common/Logger.ts";
import QuestionSection from "./QuestionSection.tsx";
export default function UpdateModalContent() {
  const { id: project_id } = useParams();
  const id = useAppSelector((state) => state.questionModal.commit_id);
  if (!project_id) {
    return <NotFound />;
  }
  const { data: projectData, isLoading: isProjectByIdLoading } =
    useGetProjectByIdQuery(parseInt(project_id) ?? skipToken);

  const { data: updateData, isLoading: isUpdateByIdLoading } =
    useGetUpdateByIdQuery(id ?? skipToken);

  const args =
    projectData?.project_git_name && projectData?.repo_url && updateData?.sha
      ? {
          user: projectData?.project_git_name,
          repo: projectData?.repo_url,
          sha: updateData?.sha,
        }
      : skipToken;

  const { data: commitData, isLoading: isCommitDataLoading } =
    useGetCommitDataQuery(args);

  const [commitReview, { isLoading: isCommitReviewLoading }] =
    useCommitReviewMutation();

  if (
    isProjectByIdLoading ||
    isUpdateByIdLoading ||
    isCommitDataLoading
  ) {
    return <Loading />;
  }
  const sortedQuestions = [...(questions ?? [])].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  let parsedFile: string[] = [];
  let parsedLines: string[] = [];

  if (commitData) {
    parsedFile = commitData.diffs.split("diff");
    parsedFile.shift();
  }

  

  const summarizeAI = async () => {
    if (!updateData?.update_id) {
      rootLogger.error("No update id");
      return;
    }
    await commitReview(updateData.update_id!);
  };
  return (
    <div className="">
      <div className="p-4 bg-neutral-800 text-white border-b border-neutral-600">
        <p className="items-center">
          Press <Kbd>Esc</Kbd> to leave{" "}
        </p>
      </div>
      <div className="flex text-white flex-row justify-between  w-full min-h-screen bg-neutral-800 ">
        <div className="p-4 flex-1/2 shrink-0 overflow-y-scroll max-h-screen [scrollbar-width:none] border-r border-neutral-600 ">
          {parsedFile.length > 0 ? (
            parsedFile.map((diff, idx) => {
                parsedLines = diff.split("\n");
                return (
                <div
                  className="mockup-code overflow-x-auto w-full my-4 "
                  key={idx}
                >
                  {parsedLines.length > 0 &&
                    parsedLines.map((line, idx) => {
                      return (
                        <div key={idx} className="break">
                          {(() => {
                            if (line.startsWith("-")) {
                              return (
                                <pre
                                  data-prefix={`${idx + 1}`}
                                  className="text-[11px] text-error break-all"
                                >
                                  {line}
                                </pre>
                              );
                            } else if (line.startsWith("+")) {
                              return (
                                <pre
                                  data-prefix={`${idx + 1}`}
                                  className="text-[11px]  text-success break-all "
                                >
                                  {line}
                                </pre>
                              );
                            } else {
                              return (
                                <pre
                                  data-prefix={`${idx + 1}`}
                                  className="text-[11px] break-all "
                                >
                                  {line}
                                </pre>
                              );
                            }
                          })()}
                        </div>
                      );
                    })}
                </div>
              );
            })
          ) : (
            <code> No code found </code>
          )}
        </div>
        <div className="flex flex-1/2 shrink-0 flex-col p-4 max-h-screen  overflow-x-scroll ">
          <div className="">
            <div className="flex flex-row gap-10 items-center">
              <h1>Code review</h1>
              <Button onClick={summarizeAI} loading={isCommitReviewLoading}>
                Summarize
              </Button>
            </div>
            <div className="h-full  overflow-x-scroll">
              <SummarizeAI />
            </div>
          </div>
          <QuestionSection/>
        </div>
      </div>
    </div>
  );
}
