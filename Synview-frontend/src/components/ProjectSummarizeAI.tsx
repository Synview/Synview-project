 
import { Paper } from "@mantine/core";

import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { skipToken } from "@reduxjs/toolkit/query";

export default function ProjectSummarizeAI() {
  const { id } = useParams();

  const { data: projectData } = useGetProjectByIdQuery(parseInt(id!) ?? skipToken)
  return (
    <Paper className="p-2 text-start !text-black">
      <ReactMarkdown>{projectData?.doc_url}</ReactMarkdown>
    </Paper>
  );
}
