import { useGetUpdateByIdQuery } from "../services/apiSlice.ts";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../hooks.ts";
import ReactMarkdown from "react-markdown";

import { Paper } from "@mantine/core";

export default function SummarizeAI() {
  const id = useAppSelector((state) => state.questionModal.commit_id);
  const { data: updateData } = useGetUpdateByIdQuery(id ?? skipToken);
  if (!updateData?.summary) {
    return <p>No summary detected</p>;
  }
  return (
    <Paper className="p-2 text-start text-[11px] !text-black whitespace-normal animation-fade-up  break-all overflow-x-scroll prose prose-sm">
      <ReactMarkdown>{updateData?.summary}</ReactMarkdown>
    </Paper>
  );
}
