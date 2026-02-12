import API from "../api/axios";

export const getRoles = async () => {
  const res = await API.get("/roles/getRoles");
  return res.data;
};

export const createRole = async (data) => {
  const res = await API.post("/roles/createRole", data);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await API.delete(`/roles/${id}`);
  return res.data;
};
