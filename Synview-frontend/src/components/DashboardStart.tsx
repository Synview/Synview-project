import React from "react";
import { useEffect } from "react";
import { getPayload } from "../apiHandler.ts";
import { z } from "zod";
import { useAppSelector, useAppDispatch } from "../hooks.ts";
import { addUser } from "../slices/userSlice.ts";
import { UserInfoSchema } from "../../../common/schemas.ts";


export default function DashboardStart() {
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const getUserInfo = async () => {
    let a = await getPayload();
    try {
      if (!a) {
        throw new Error("no payload");
      }
      a = UserInfoSchema.parse(a); // <--- For some reason this line isn't necessary but im afraid to remove it

      dispatch(addUser(a));
    } catch (error) {
      throw new Error("error" + error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <p className="text-5xl mb-20">
        Get started on your first proyect {user.username}
      </p>
      <button type="button" className="btn">
        Create new project
      </button>
    </div>
  );
}
