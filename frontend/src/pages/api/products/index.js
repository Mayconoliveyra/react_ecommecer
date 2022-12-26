import api from "../axios";

const prefix = "/products";

export const getAll = async (page = 1, limit = 150) => {
  return await api.get(`${prefix}?_page=${page}&_limit=${limit}`).then(res => res.data);
};

export const getByID = async (id) => {
  return await api.get(`${prefix}/${id}`).then((res) => res.data);
};

export const getSearch = async (textSearch, page = 1, limit = 150) => {
  return await api.get(`${prefix}/?_page=${page}&_limit=${limit}&_search=${textSearch}`).then((res) => res.data);
};
