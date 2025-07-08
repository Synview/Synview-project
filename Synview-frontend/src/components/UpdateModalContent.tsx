import React, { useState } from "react";

import { useAppSelector } from "../hooks.ts";
import {
  useGetPayloadQuery,
  useGetUpdateQuestionsQuery,
  usePostQuestionMutation,
} from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
export default function UpdateModalContent() {
  const [textUpdate, setTextUpdate] = useState("");
  const [postQuestion] = usePostQuestionMutation();
  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const id = useAppSelector((state) => state.questionModal.commit_id);
  const { data: questions, isLoading: QuestionsLoading } =
    useGetUpdateQuestionsQuery(id ?? 0, {
      skip: !id,
    });

  if (QuestionsLoading || isUserLoading) {
    return <Loading />;
  }

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

  return (
    <div className="flex text-white flex-row justify-between mt-4 w-full min-h-screen bg-neutral-800">
      <div className="p-4 flex-1/2">
        <h1>{id}</h1>
      </div>
      <div className="flex flex-1/3 flex-col p-4">
        <div className="h-[50%]">
          <h1>Code review</h1>
          <div className="border h-96 p-1">
            <p>Get a summry with AI!</p>
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
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          <div className="border min-h-24">
            {questions &&
              questions.map((questions) => {
                return (
                  <div key={questions.question_id}>
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
