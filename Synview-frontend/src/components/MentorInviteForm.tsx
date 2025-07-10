import React, { useState } from "react";
import { useInviteMentorMutation } from "../services/apiSlice.ts";
import { useAppSelector } from "../hooks.ts";
import { ProjectRoles } from "../../../common/schemas.ts";
export default function MentorInviteForm() {
  const [invitedMentorId, setInvitedMentorId] = useState("");

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
          role: ProjectRoles.REVIEWER,
          invited_user_id: parseInt(invitedMentorId),
          inviting_user_id: userId,
          invited_project_id: projectId,
        });
        setInvitedMentorId("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <fieldset className="fieldset border-1 p-4 rounded-box border-neutral-600 bg-neutral-800">
        <div className="flex flex-col justify-center">
          <form onSubmit={handleInviteForm}>
            <label>Id</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="id"
              id="Username"
              value={invitedMentorId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInvitedMentorId(e.target.value);
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
