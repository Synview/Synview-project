import  { useState, type ChangeEvent, type FormEvent } from "react";
import { useGetPayloadQuery, usePostUpdateMutation } from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
export default function NewUpdate() {
  const [textUpdate, setTextUpdate] = useState("");
  const [postUpdate] = usePostUpdateMutation();
  const { data: UserData } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { id: ProjectId } = useParams();

  const handleNewUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (ProjectId && UserData) {
        await postUpdate({
          description: textUpdate,
          user_id: UserData?.id,
          project_id: parseInt(ProjectId),
        });
        setTextUpdate("");
      }
    } catch (error) {
      throw new Error("Couldn't create an Update" + error);
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
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
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
