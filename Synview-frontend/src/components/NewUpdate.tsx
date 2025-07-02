import React, { ChangeEvent, useState } from "react";
import { useGetPayloadQuery, usePostUpdateMutation } from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
export default function NewUpdate() {
  const [textUpdate, setTextUpdate] = useState("");
  const [postUpdate, { data, error, isLoading }] = usePostUpdateMutation();
  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { id: ProjectId } = useParams();

  const handleNewUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (ProjectId && UserData) {
        await postUpdate({
          Comments: textUpdate,
          UserId: UserData?.id,
          ProjectId: parseInt(ProjectId),
        });
        setTextUpdate("");
      }
    } catch (error) {
      throw new Error("Couldn't create a project" + error);
    }
  };

  return (
    <div>
      <form onSubmit={handleNewUpdate}>
        <details className="dropdown">
          <summary className="btn m-1">Add new update</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 h-60 w-92 not-first:p-2 shadow-sm">
            <li className=" h-full w-full">
              <textarea
                id="description"
                value={textUpdate}
                onChange={(e: ChangeEvent<any>) => {
                  setTextUpdate(e.target.value);
                }}
                className="textarea h-full w-full"
                placeholder="Add your description"
              ></textarea>
              <button type="submit" className="btn relative ml-6">
                {" "}
                Submit{" "}
              </button>
            </li>
          </ul>
        </details>
      </form>
    </div>
  );
}
