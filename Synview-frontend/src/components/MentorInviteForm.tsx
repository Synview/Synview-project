import React, { useState } from "react";
import { useInviteMentorMutation } from "../services/apiSlice.ts";
import { useAppSelector } from "../hooks.ts";
import { ProjectRolesSchema } from "../../../common/schemas.ts";
import { rootLogger } from "../../../common/Logger.ts";
export default function MentorInviteForm() {
  const [invitedMentorUsername, setInvitedMentorUsername] = useState("");

  const projectId = useAppSelector(
    (state) => state.inviteMentorModal.project_id
  );
  const userId = useAppSelector((state) => state.inviteMentorModal.user_id);
  const [inviteMentor] = useInviteMentorMutation();
  const handleInviteForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (projectId && userId) {
        await inviteMentor({
          role: ProjectRolesSchema.enum.REVIEWER,
          invited_username: invitedMentorUsername,
          inviting_user_id: userId,
          invited_project_id: projectId,
        });
        setInvitedMentorUsername("");
      }
    } catch (error) {
      rootLogger.error(`${error}`);
    }
  };

  return (
    <div className="">
      <fieldset className="fieldset border-1 p-4 rounded-box border-neutral-600 bg-neutral-800">
        <div className="flex flex-col justify-center">
          <form onSubmit={handleInviteForm}>
            <label>Username</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Write username here"
              id="Username"
              value={invitedMentorUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInvitedMentorUsername(e.target.value);
              }}
            />
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
