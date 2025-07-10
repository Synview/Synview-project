import React, { useState, type ChangeEvent, type FormEvent } from "react";
import {
  useGetPayloadQuery,
  usePostProjectMutation,
} from "../services/apiSlice.ts";
export default function NewProject() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { data: UserData, isLoading: isUserLoading } = useGetPayloadQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [postProject] = usePostProjectMutation();
  const handleNewProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (UserData?.id) {
        await postProject({
          description: projectDescription,
          title: projectName,
          owner_id: UserData?.id,
        });
        setProjectDescription("");
        setProjectName("");
      }
    } catch (error) {
      throw new Error("Couldn't create a project" + error);
    }
  };
  return (
    <div>
      <label htmlFor="my_modal_7" className="cursor-pointer">
        <div className="group border  border-neutral-700 flex justify-center items-center h-[310px]  hover:border-neutral-400 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg "
            height={100}
            width={100}
            fill="#262626"
            className="fill-neutral-700 group-hover:fill-neutral-400 transition"
            viewBox="0 0 448 512"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </div>
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle visible" />
      <div className="modal  text-black" role="dialog">
        <div className="modal-box bg-neutral-700 ">
          <form className=" flex flex-col gap-5" onSubmit={handleNewProject}>
            <label className="text-whiteleucliduugrfjggrrubncbdfihthieih">
              Create your project!
            </label>
            <input
              className="input w-full"
              typeof="text"
              placeholder="Project Name"
              id="projectName"
              value={projectName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setProjectName(e.target.value);
              }}
            ></input>

            <textarea
              id="description"
              value={projectDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setProjectDescription(e.target.value);
              }}
              className="textarea h-24 w-full"
              placeholder="Add your description"
            ></textarea>

            <div className="flex justify-between items-center">
              <button type="submit" className="btn w-fit mt-2">
                Create
              </button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7"></label>
      </div>
    </div>
  );
}
