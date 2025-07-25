 

import type { Update as UpdateInfo } from "../../../common/types.ts";
import { useAppDispatch } from "../hooks.ts";
import { openQuestionModal } from "../slices/questionModalSlice.ts";
import { Text } from "@mantine/core";
import { TimeValue } from "@mantine/dates";
export default function Update({
  created_at: createdAt,
  description,
  update_id,
}: UpdateInfo) {
  const dispatch = useAppDispatch();
  return (
    <>
      <hr />
      <div className="timeline-start ">
        <Text>
         {new Date(createdAt).toLocaleDateString()} at <TimeValue format="12h" value={new Date(createdAt)} /> 
        </Text>
      </div>
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="timeline-end timeline-box flex w-[90%] items-center justify-between">
        <p className=" text-black break-all text-left"> {description}</p>
        <div className="flex gap-4">
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(openQuestionModal(update_id))}
          >
            View
          </button>
        </div>
      </div>
      <hr />
    </>
  );
}
