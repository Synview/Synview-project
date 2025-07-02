import React, { ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EmailLoginRequestSchema } from "../../../common/schemas.ts";
import { useGetPayloadQuery } from "../services/apiSlice.ts";
import { addUser } from "../slices/userSlice.ts";
import { useAppDispatch , useAppSelector} from "../hooks.ts";
import { useLoginMutation } from "../services/apiSlice.ts";
export default function LoginForm() {

  const [login] = useLoginMutation();
  const { data, error, isLoading } = useGetPayloadQuery();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tryAgain, setTryAgain] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await login({
        email: email,
        password: password,
      }).unwrap();
      if (res.token) {
        navigate("/dashboard");
      }
    } catch (error) {
      setTryAgain(true);
      console.error(error);
    }
  };

 
  return (
    <div className="w-[70%] max-h-[50%] flex justify-center border-1 border-neutral-600 bg-neutral-950 rounded-box p-4">
      <fieldset className="fieldset border-1 p-4 rounded-box border-neutral-600 bg-neutral-800">
        <legend className="fieldset-legend text-white ">Login</legend>
        <div className="">
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e: ChangeEvent<any>) => {
                setEmail(e.target.value);
              }}
            />
            <label>Password</label>
            <input
              className="input bg-neutral-700 w-full"
              typeof="text"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e: ChangeEvent<any>) => {
                setPassword(e.target.value);
              }}
            ></input>
            <div className="flex justify-center items-center flex-col">
              <button
                type="submit"
                className={`btn  ${
                  tryAgain ? " tooltip tooltip-open tooltip-bottom" : ""
                } w-fit mt-2`}
                data-tip="Try again"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </fieldset>
    </div>
  );
}
