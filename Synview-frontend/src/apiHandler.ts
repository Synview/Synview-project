import { UserInfoSchema } from '../../common/schemas.ts';

const url = import.meta.env.VITE_URL;
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
type RegisterData = {
  username: string;
  email: string;
  password: string;
};
type LoginData = {
  password: string;
  email: string;
};

const Register = async (data: RegisterData) => {
  await fetch(`${url}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
    }),
  });
};

const Login = async (data: LoginData) => {
  const responseData = await fetch(`${url}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  }).then((response) => [response.ok, response.headers.get("Authorization")]);
  return responseData;
};

const getPayload = async () => {
  const response = await fetch(`${url}/getPayload`, {
    method: "GET",
    credentials: "include",
    headers: headers,
  }).then((response) => {
    return response;
  });

  const body = await response.json();
  return UserInfoSchema.parse(body);
};

const getMyProjects = async (id: number) => {
  const MyProjects = await fetch(`${url}/getMyProjects/${id}`, {
    method: "GET",
    credentials: "include",
    headers: headers
  }).then((response) => {
    console.log(response)
    return response.json();
  });
  return MyProjects
};

export { Register, Login, getPayload, getMyProjects };
