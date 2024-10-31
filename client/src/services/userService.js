import api from "../utils/api";

export const login = async (username, password) => {
  const response = await api.post("/users/login", { username, password });
  console.log(response);
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("/users/register", {
    username,
    email,
    password,
  });
  return response.data;
};
