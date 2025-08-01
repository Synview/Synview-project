import { TimeValue } from "@mantine/dates";
import type { Question } from "../../../common/types.ts";
import { useGetUserByIdQuery } from "../services/apiSlice.ts";

export default function Question(props: Question) {
  const {data } = useGetUserByIdQuery(props.user_id)
  return (
    <div className="p-1 m-1 border-t border-neutral-600 rounded whitespace-normal break-all  flex justify-between ">
      <div>
        {data?.username}: {props.content}
      </div>
      <div className="min-w-40">
      <TimeValue format="12h" value={new Date(props.created_at)} /> - {new Date(props.created_at).toLocaleDateString()} 
      </div>
    </div>
  );
}
