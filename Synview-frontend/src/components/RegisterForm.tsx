import React, { type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "../services/apiSlice.ts";
import { rootLogger } from "../../../common/Logger.ts";

export default function LoginForm() {
  const [register] = useRegisterMutation();

  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
       await register({
        username: username,
        email: email,
        password: password,
      }).unwrap();
      navigate("/login");
    } catch (error) {
      rootLogger.error(`${error}`);
    }
  };

  return (
    <div className="mr-44 mt-44 w-92 text-start bg-neutral-900 border-neutral-600 p-4 border-1 rounded-box">
      <fieldset className="fieldset border-1 p-4 rounded-box border-neutral-600 bg-neutral-800">
        <legend className="fieldset-legend text-white ">Register</legend>
        <div className="flex flex-col justify-center">
          <form onSubmit={handleRegister}>
            <label>Username</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Name"
              id="Username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value);
              }}
            ></input>
            <label>Email</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            ></input>
            <label>Password</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            ></input>
            <div className="flex justify-between items-center">
              <button type="submit" className="btn w-fit mt-2">
                Register
              </button>
              <Link to="/login">Or log in</Link>
            </div>
          </form>
        </div>
      </fieldset>
    </div>
  );
}
