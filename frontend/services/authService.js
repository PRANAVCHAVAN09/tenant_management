import API from "../api/axios";

export const loginAdmin = async (data) => {
  const res = await API.post("/auth/login", data);
  
  return res.data;
};

export const logoutUser = async () => {
  return API.post("/auth/logout",{});
};