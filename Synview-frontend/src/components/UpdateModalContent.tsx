import React, { useState, type ChangeEvent } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAppSelector } from "../hooks.ts";
import {
  useGetPayloadQuery,
  useGetUpdateQuestionsQuery,
  usePostQuestionMutation,
  useGetCommitDataQuery,
  useGetProjectByIdQuery,
  useGetUpdateByIdQuery,
  useCommitReviewMutation,
  useProjectReviewMutation,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound.tsx";
import SummarizeAI from "./SummarizeAI.tsx";
import { Button } from "@mantine/core";
import { rootLogger } from "../../../common/Logger.ts";
export default function UpdateModalContent() {
  const { id: project_id } = useParams();
  const id = useAppSelector((state) => state.questionModal.commit_id);
  if (!project_id) {
    return <NotFound />;
  }
  const { data: projectData, isLoading: isProjectByIdLoading } =
    useGetProjectByIdQuery(parseInt(project_id) ?? skipToken);
  const [textUpdate, setTextUpdate] = useState("");
  const [postQuestion] = usePostQuestionMutation();

  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: questions, isLoading: isQuestionsLoading } =
    useGetUpdateQuestionsQuery(id ?? skipToken);

  const { data: updateData, isLoading: isUpdateByIdLoading } =
    useGetUpdateByIdQuery(id ?? skipToken);

  const args =
    UserData?.username && projectData?.repo_url && updateData?.sha
      ? {
          user: UserData?.username,
          repo: projectData?.repo_url,
          sha: updateData?.sha,
        }
      : skipToken;

  const { data: commitData, isLoading: isCommitDataLoading } =
    useGetCommitDataQuery(args);

  const [commitReview, { data: reviewData, isLoading: isCommitReviewLoading }] =
    useCommitReviewMutation();

  if (
    isQuestionsLoading ||
    isUserLoading ||
    isProjectByIdLoading ||
    isUpdateByIdLoading ||
    isCommitDataLoading
  ) {
    return <Loading />;
  }
  const sortedQuestions = [...questions!].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleNewUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id && UserData?.id) {
        await postQuestion({
          content: textUpdate,
          update_id: id,
          user_id: UserData.id,
        });
        setTextUpdate("");
      }
    } catch (error) {
      throw new Error("Couldn't create an Update" + error);
    }
  };

  const summarizeAI = async () => {
    if (!updateData?.update_id) {
      rootLogger.error("No update id");
      return;
    }
    await commitReview(updateData.update_id!);
  };
  return (
    <div className="flex text-white flex-row justify-between w-full min-h-screen bg-neutral-800 ">
      <div className="p-4 flex-1/2">
        <div className="mockup-code h-full w-full">
          <pre data-prefix="$">
            {commitData ? (
              <code className="break-all whitespace-break-spaces">
                {commitData.diffs}
              </code>
            ) : (
              <code>No code found</code>
            )}
          </pre>
        </div>
      </div>
      <div className="flex flex-1/3 flex-col p-4">
        <div className="">
          <div className="flex flex-row gap-10 items-center">
            <h1>Code review</h1>
            <Button onClick={summarizeAI} loading={isCommitReviewLoading}>
              Summarize
            </Button>
          </div>
          <div className="">
            <SummarizeAI />
          </div>
        </div>
        <div className="flex flex-col mt-8 h-[50%]">
          <div className="flex items-center gap-10">
            <h1>Questions</h1>
            <form onSubmit={handleNewUpdate}>
              <details className="dropdown">
                <summary className="btn m-1">Be curious!</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 h-60 w-92 not-first:p-2 shadow-sm">
                  <li className=" h-full w-full">
                    <textarea
                      id="description"
                      value={textUpdate}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setTextUpdate(e.target.value);
                      }}
                      className="textarea h-full w-full"
                      placeholder="Add your description"
                    ></textarea>
                    <button type="submit" className="btn relative ml-6">
                      Submit
                    </button>
                  </li>
                </ul>
              </details>
            </form>
          </div>
          <div className="min-h-24">
            {sortedQuestions &&
              sortedQuestions.map((questions, idx) => {
                return (
                  <div
                    key={questions.question_id}
                    className={`p-1 m-1 border rounded ${
                      idx === 0 ? "animation-fade" : ""
                    }`}
                  >
                    <h2>{questions.content}</h2>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
