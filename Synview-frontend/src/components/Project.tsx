import React from "react";
interface Project {
  ProjectId: number;
  title: string;
  description: string;
  owner_id: number;
  repo_url: string;
  doc_url: string;
  created_at: Date;
}
export default function Project({ title, description }: Project) {
  return (
    <div className="card bg-stone-800 shadow-sm">
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
