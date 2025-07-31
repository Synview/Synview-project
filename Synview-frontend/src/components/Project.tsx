import type { Project } from "../../../common/types.ts";
import { Link } from "react-router-dom";
import {
  useGetMentorsQuery,
  useGetMyUpdatesQuery,
} from "../services/apiSlice.ts";
import { skipToken } from "@reduxjs/toolkit/query";
import { Badge, Text } from "@mantine/core";
import { Spoiler } from "@mantine/core";

export default function Project({ title, description, project_id }: Project) {
  const { data: projectUpdates, isLoading: isUpdatesLoading } =
    useGetMyUpdatesQuery(String(project_id) ?? skipToken);
  const { data: reviewingUsers, isLoading: isUsersLoading } =
    useGetMentorsQuery(project_id ?? skipToken);

  if (isUpdatesLoading || isUsersLoading) {
    return;
  }

  const sortedUpdates = [...(projectUpdates ?? [])].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <Link to={`/dashboard/project/${project_id}`}>
      <div className="card bg-neutral-800 shadow-sm h-[310px]">
        <div className="card-body text-left justify-between">
          <div>
            <div className="border-b border-neutral-600 flex flex-row items-center gap-4 pb-4">
              <h2 className="card-title">{title}</h2>{" "}
              <Badge color="rgba(96, 98, 143, 1)">
                {projectUpdates?.length} Updates
              </Badge>
            </div>
            <div className="pt-4">
              <p className=" whitespace-normal  break-all">
                <Text fz="md" c="dimmed">
                  Project description
                </Text>
                <br></br>{" "}
                <Spoiler maxHeight={120} showLabel="..." hideLabel="Hide">
                  {description}{" "}
                </Spoiler>
              </p>
            </div>
          </div>
          <div>
            <div>
              <Text fz="md" c="dimmed">
                Last update :
                {sortedUpdates.length > 0
                  ? new Date(
                      sortedUpdates.at(0)?.created_at!
                    ).toLocaleDateString()
                  : " No updates yet"}
              </Text>
            </div>
            <div>
              <Badge size="sm" color="gray">
                {reviewingUsers?.length}
                {reviewingUsers && reviewingUsers?.length === 0
                  ? " Reviewers"
                  : " Reviewer"}
              </Badge>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
