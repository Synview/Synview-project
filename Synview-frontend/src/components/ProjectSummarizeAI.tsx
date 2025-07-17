import React from "react";
import { Paper, Text } from "@mantine/core";

import { useGetProjectByIdQuery } from "../services/apiSlice.ts";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export default function ProjectSummarizeAI() {
  const { id } = useParams();

  const { data: projectData } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });
  return (
    <Paper className="p-2 text-start !text-black">
      <ReactMarkdown>{projectData?.doc_url}</ReactMarkdown>
    </Paper>
  );
}
