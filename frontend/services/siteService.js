import API from "../api/axios";

export const getPaginatedSites = async (page) => {
  const res = await API.get(`/sites/paginatedSites?page=${page}`);
  return res.data;
};

export const getSites = async (page) => {
  const res = await API.get(`/sites/getAllSites`);
  return res.data;
};

export const createSite = async (data) => {
  const res = await API.post("/sites/createSite", data);
  return res.data;
};

export const deleteSite = async (id) => {
  const res = await API.delete(`/sites/${id}`);
  return res.data;
};

export const getTimezones = async () => {
  const res = await API.get("/sites/timezones");
  return res.data;
};
