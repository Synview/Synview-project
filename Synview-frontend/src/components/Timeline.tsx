import React from "react";
import Update from "./Update.tsx";
import NotFound from "./NotFound.tsx";
import { useParams } from "react-router-dom";
import { useGetMyUpdatesQuery } from "../services/apiSlice.ts";
export default function Timeline() {
  const { id } = useParams();

  const {
    data: updates,
    error,
    isLoading,
  } = useGetMyUpdatesQuery(id ?? "", {
    skip: !id,
  });
  return (
    <div>
      {updates ? (
        updates.map((update) => {
          return (
            <div key={update.UpdateId}>
              <Update {...update} />
            </div>
          );
        })
      ) : (
        <NotFound />
      )}
    </div>
  );
}
