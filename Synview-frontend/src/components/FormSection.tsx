import React from "react";
import Form from "./RegisterForm.tsx";
export default function FormSection() {
  return (
    <div className="h-screen bg-neutral-900 bg-[url(./public/formbg.svg)] bg-no-repeat">
      <div className="flex justify-evenly  ">
        <p className="m-44 text-7xl w-96 text-start">This is the form section</p>
        <Form />
        <img></img>
      </div>
    </div>
  );
}
