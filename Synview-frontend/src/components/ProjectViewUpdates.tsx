import React from "react";
import NewUpdate from "./NewUpdate.tsx";
import Timeline from "./Timeline.tsx";
export default function ProjectViewUpdates() {
  return (
    <div className="bg-amber-500 flex-1">
      <div>
        <NewUpdate />
      </div>
      <div>
        <Timeline />
      </div>
    </div>
  );
}
