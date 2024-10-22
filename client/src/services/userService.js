import api from "../utils/api";

export const login = async (username, password) => {
  const response = await api.post("/users/login", { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post("/users/register", { username, password });
  return response.data;
};
