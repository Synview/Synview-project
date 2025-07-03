import React from "react";
import type { Update as UpdateInfo } from "../../../common/types.ts";
export default function Update({ created_at, Comments }: UpdateInfo) {
  return (
    <div>
      <div className="collapse bg-base-100 border text-black border-base-300">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">
          {created_at.toString()}
        </div>
        <div className="collapse-content text-sm">{Comments}</div>
      </div>
    </div>
  );
}
