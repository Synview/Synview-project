import React, { useState, type ChangeEvent } from "react";

import { skipToken } from "@reduxjs/toolkit/query/react";
import { useAppSelector } from "../hooks.ts";
import {
  useGetPayloadQuery,
  useGetUpdateQuestionsQuery,
  usePostQuestionMutation,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
import Question from "./Question.tsx";
export default function QuestionSection() {
  const id = useAppSelector((state) => state.questionModal.commit_id);

  const { data: questions, isLoading: isQuestionsLoading } =
    useGetUpdateQuestionsQuery(id ?? skipToken);

  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [textUpdate, setTextUpdate] = useState("");
  const [postQuestion] = usePostQuestionMutation();
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

  if (isQuestionsLoading || isUserLoading) {
    return <Loading />;
  }

  const sortedQuestions = [...questions!].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return (
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
          sortedQuestions.map((question, idx) => {
            return (
              <div
                key={question.question_id}
                className={`${
                  idx === 0 ? "animation-fade" : ""
                }`}
              >
                <Question {...question}/>
              </div>
            );
          })}
      </div>
    </div>
  );
}
