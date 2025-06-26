import React from "react";
import { Link } from "react-router-dom";
export default function LoginForm() {
  return (
    <div className="mr-44 mt-44 w-92 text-start bg-stone-900 border-stone-600 p-4 border-1 rounded-box">
      <fieldset className="fieldset border-1 p-4 rounded-box border-stone-600 bg-stone-800">
        <legend className="fieldset-legend text-white ">Register</legend>
        <div className="flex flex-col justify-center">
          <label>Username</label>
          <input
            className="input bg-stone-700 w-full"
            typeof="text"
            placeholder="Name"
            id="Username"
          ></input>
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
          <div className="flex justify-between items-center">
            <button type="button" className="btn w-fit mt-2">
              Register
            </button>
            <Link to="/login">
              <a>Or log in</a>
            </Link>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
