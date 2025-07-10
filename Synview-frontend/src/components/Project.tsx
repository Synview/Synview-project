import React from "react";
import type { Project } from "../../../common/types.ts";
import { Link } from "react-router-dom";

export default function Project({ title, description, project_id }: Project) {
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
            <Link to={`/dashboard/project/${project_id}`}>View project</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
