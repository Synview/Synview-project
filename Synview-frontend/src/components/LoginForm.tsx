import React from "react";
export default function LoginForm() {
  return (
    <div className="w-[50%] max-h-[30%] flex justify-center">
      <fieldset className="fieldset border-1 p-4 rounded-box border-stone-600 bg-stone-800">
        <legend className="fieldset-legend text-white ">Login</legend>
        <div className="">
          <label>Email</label>
          <input
            className="input bg-stone-700 w-full"
            typeof="text"
            placeholder="Email"
            id="email"
          ></input>
          <label>Password</label>
          <input
            className="input bg-stone-700 w-full"
            typeof="text"
            placeholder="Password"
            id="password"
          ></input>
          <div className="flex justify-center items-center">
            <button type="button" className="btn w-fit mt-2">
              Login
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
