import React from "react";
import { useGetProjectByIdQuery } from "../services/apiSlice.ts";

import { Textarea } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function ProjectSummarizeAI() {
  const { id } = useParams();

  const { data: projectData } = useGetProjectByIdQuery(id ?? "", {
    skip: !id,
  });
  return (
      <Textarea
        autosize
        label="AI summarize"
        variant="light"
        radius="lg"
        placeholder={projectData?.doc_url}
        disabled
        className="flex-1 "
      />
  );
}
