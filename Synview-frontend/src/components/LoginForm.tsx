import React, { ChangeEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Login } from "../Api_handler.ts";
import { z } from "zod";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();

  const EmailLoginRequestSchema = z.object({
    ["email"]: z.string().email(),
    ["password"]: z.string(),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tryAgain, setTryAgain] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = {
        email: email,
        password: password,
      };
      const TypeSafeData = EmailLoginRequestSchema.parse(formData);
      const data = await Login(TypeSafeData);
    
      console.log(data)
      if (data[0]) {
        navigate("/dashboard");
      }
    } catch (error) {
      setTryAgain(true);
      console.log(error);
    }
  };

  return (
    <div className="w-[70%] max-h-[50%] flex justify-center border-1 border-stone-600 bg-stone-950 rounded-box p-4">
      <fieldset className="fieldset border-1 p-4 rounded-box border-stone-600 bg-stone-800">
        <legend className="fieldset-legend text-white ">Login</legend>
        <div className="">
          <form onSubmit={handleSubmit}>
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
            <div className="flex justify-center items-center flex-col">
              <button type="submit" className={`btn  ${tryAgain ? " tooltip tooltip-open tooltip-bottom" : ""} w-fit mt-2`} data-tip="Try again">
                Login
              </button>
            </div>
          </form>
        </div>
      </fieldset>
    </div>
  );
}
