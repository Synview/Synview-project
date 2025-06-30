const url = import.meta.env.VITE_URL;
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
  }).then((response) => {
    const data = [response.ok, response.headers.get("Authorization")];
    return data;
  });
  return responseData;
};

const getPayload = async () => {
  const response = await fetch(`${url}/getPayload`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  }).then((response) => {
    return response;
  });

  const body = response.json();
  return body;
};

export { Register, Login, getPayload };
