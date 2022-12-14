import api from "../API";

const prefix = "/products";

export const getAll = async (page = 1, limit = 150) => {
  return await api.get(`${prefix}?_page=${page}&_limit=${limit}`);
};

export const getByID = async (id) => {
  return await api.get(`${prefix}/${id}`);
};

export const getSearch = async (textSearch, page = 1, limit = 150) => {
  return await api.get(`${prefix}/?_page=${page}&_limit=${limit}&_search=${textSearch}`);
};

export const store = async (data, id = null) => {
  if (id) {
    return await api.put(`${prefix}/${id}`, data);
  }
  return await api.post(`${prefix}`, data);
};

export const destroy = async (id) => {
  return await api.delete(`${prefix}/${id}`);
};
