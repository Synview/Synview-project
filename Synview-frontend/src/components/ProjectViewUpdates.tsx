import React from "react";
import NewUpdate from "./NewUpdate.tsx";
import Timeline from "./Timeline.tsx";
export default function ProjectViewUpdates() {
  return (
    <div className="bg-neutral-700 flex-1 overflow-y-scroll [scrollbar-width:none]">
      <div className="mt-10 overflow-y-scroll">
        <NewUpdate />
        <Timeline />
      </div>
    </div>
  );
}
