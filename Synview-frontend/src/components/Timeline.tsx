import React from "react";
import Update from "./Update.tsx";
import NotFound from "./NotFound.tsx";
import { useParams } from "react-router-dom";
import { useGetMyUpdatesQuery } from "../services/apiSlice.ts";
import Loading from "../components/HelperComponents/Loading.tsx";
export default function Timeline() {
  const { id } = useParams();

  if (!id) {
    return <Loading />;
  }

  const { data: updates, error, isLoading } = useGetMyUpdatesQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ul className="timeline timeline-vertical">
        <li className="">
          <div className="timeline-start">Current</div>
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
        </li>
        {updates ? (
          updates.map((update) => {
            return (
              <li className="" key={update.update_id}>
                <Update {...update} />
              </li>
            );
          })
        ) : (
          <NotFound />
        )}
      </ul>
    </div>
  );
}
