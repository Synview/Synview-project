import { TimeValue } from "@mantine/dates";
import type { Question } from "../../../common/types.ts";

export default function Question(props: Question) {

  return (
    <div className="p-1 m-1 border rounded flex justify-between ">
      <div>
        {props.user_id} {props.content}
      </div>
      <TimeValue format="12h" value={new Date(props.created_at)} />
    </div>
  );
}
