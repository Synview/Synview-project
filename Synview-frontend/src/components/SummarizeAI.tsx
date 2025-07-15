import React from "react";
import { useGetUpdateByIdQuery } from "../services/apiSlice.ts";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../hooks.ts";
import { Textarea } from "@mantine/core";

export default function SummarizeAI() {
  const id = useAppSelector((state) => state.questionModal.commit_id);
  const { data: updateData } = useGetUpdateByIdQuery(id ?? skipToken);
  return (
    <Textarea
      autosize
      label="AI summarize"
      variant="light"
      radius="lg"
      placeholder={updateData?.summary}
      disabled
      className="flex-1"
    />
  );
}
