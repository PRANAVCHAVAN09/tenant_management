import API from "../api/axios";

// GET USERS (pagination + search)
export const getUsers = async (page = 1, search = "") => {
  const res = await API.get(`/users/getAllUsers?page=${page}&search=${search}`);
  return res.data;
};

// CREATE USER
export const createUser = async (data) => {
  const res = await API.post("/users/createUser", data);
  return res.data;
};

// GET SINGLE USER (optional)
export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

// UPDATE USER
export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

// DEACTIVATE USER
export const deactivateUser = async (id) => {
  const res = await API.patch(`/users/${id}/deactivate`);
  return res.data;
};
