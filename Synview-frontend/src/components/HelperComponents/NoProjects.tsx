import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks.ts";
export default function NoProjects() {
  const user = useAppSelector((state) => state.user);

  return (
    <div>
      <p className="text-5xl mb-20">
        Get started on your first proyect {user.username}
      </p>
      <button type="button" className="btn">
        Create new project
      </button>
    </div>
  );
}
