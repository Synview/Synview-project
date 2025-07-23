import React from "react";
import LoginForm from "./LoginForm.tsx";
export default function Login() {
  return (
    <div className="flex justify-center w-full h-full bg-[url(./public/formbg.svg)]  bg-neutral-900  bg-no-repeat">
      <div className="flex flex-col mt-[10%]  items-center">
        <LoginForm />
      </div>
    </div>
  );
}
