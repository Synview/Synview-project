import React from "react";
export default function Form() {
  return (
    <div className="mr-44 mt-44 w-92 text-start ">
      <fieldset className="fieldset border-1 p-4 rounded-box border-stone-600 bg-stone-800">
        <legend className="fieldset-legend text-white ">Register</legend>
        <label>Username</label>
        <input
          className="input bg-stone-700"
          typeof="text"
          placeholder="Name"
          id="Username"
        ></input>
        <label>Email</label>
        <input
          className="input bg-stone-700"
          typeof="text"
          placeholder="Email"
          id="email"
        ></input>
        <label>Password</label>
        <input
          className="input bg-stone-700"
          typeof="text"
          placeholder="Password"
          id="password"
        ></input>
        <button type="button" className="btn w-fit">Submit </button>
      </fieldset>
    </div>
  );
}
