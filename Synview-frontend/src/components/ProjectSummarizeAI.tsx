import { Paper } from "@mantine/core";

import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { skipToken } from "@reduxjs/toolkit/query";

export default function ProjectSummarizeAI() {
  const { id } = useParams();

  const { data: projectData } = useGetProjectByIdQuery(
    parseInt(id!) ?? skipToken
  );

  if (!projectData?.ai_summary) {
    return null;
  }

  return (
    <Paper className="p-2 text-start !text-black">
      <ReactMarkdown>{projectData?.ai_summary}</ReactMarkdown>
    </Paper>
  );
}
