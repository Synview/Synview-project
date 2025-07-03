import React from "react";
import type { Project } from "../../../common/types.ts";

export default function Project({ title, description }: Project) {
  return (
    <div className="card bg-neutral-800 shadow-sm h-[310px]">
      <figure>
        <img src="https://picsum.photos/300/150" alt="project"></img>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <p>{}</p>
        <div className="card-actions justify-end">
          <button type="button" className="btn">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
