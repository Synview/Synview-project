import React, { ChangeEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Register } from "../apiHandler.ts";
import { z } from "zod";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();

  const EmailRegisterRequestSchema = z.object({
    ["username"]: z.string(),
    ["email"]: z.string().email(),
    ["password"]: z.string(),
  });

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      username: username,
      email: email,
      password: password,
    };

    const TypeSafeData = EmailRegisterRequestSchema.parse(formData);
    await Register(TypeSafeData);

    navigate('/login')

  };

  return (
    <div className="mr-44 mt-44 w-92 text-start bg-stone-900 border-stone-600 p-4 border-1 rounded-box">
      <fieldset className="fieldset border-1 p-4 rounded-box border-stone-600 bg-stone-800">
        <legend className="fieldset-legend text-white ">Register</legend>
        <div className="flex flex-col justify-center">
          <form onSubmit={handleRegister}>
            <label>Username</label>
            <input
              className="input bg-stone-700 w-full"
              typeof="text"
              placeholder="Name"
              id="Username"
              value={username}
              onChange={(e: ChangeEvent<any>) => {
                setUserName(e.target.value);
              }}
            ></input>
            <label>Email</label>
            <input
              className="input bg-stone-700 w-full"
              typeof="text"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<any>) => {
                setEmail(e.target.value);
              }}
            ></input>
            <label>Password</label>
            <input
              className="input bg-stone-700 w-full"
              typeof="text"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<any>) => {
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
