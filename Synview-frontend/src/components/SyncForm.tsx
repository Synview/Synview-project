import React, { useState } from "react";
import { useGetMyCommitsMutation } from "../services/apiSlice.ts";
import { useAppSelector } from "../hooks.ts";

export default function SyncForm() {
  const [githubUsername, setGithubUsername] = useState("");
  const [projectName, setProjectName] = useState("");
  const [getCommits] = useGetMyCommitsMutation();
  const project_id = useAppSelector((state) => state.githubModal.project_id);
  const user_id = useAppSelector((state) => state.githubModal.user_id);

  const handleSyncForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (projectName && githubUsername && project_id && user_id) {
        await getCommits({
          project_id: project_id,
          user_id: user_id,
          repo_name: projectName,
          github_user: githubUsername,
        });
        setGithubUsername("");
        setProjectName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <fieldset className="fieldset border-1 p-4 rounded-box border-neutral-600 bg-neutral-800">
        <div className="flex flex-col justify-center">
          <form onSubmit={handleSyncForm}>
            <label>Github username</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Name"
              id="Username"
              value={githubUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGithubUsername(e.target.value);
              }}
            ></input>
            <label>Github proyect name</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Password"
              id="password"
              value={projectName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setProjectName(e.target.value);
              }}
            ></input>
            <div className="flex justify-between items-center">
              <button type="submit" className="btn w-fit mt-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </fieldset>
    </div>
  );
}
