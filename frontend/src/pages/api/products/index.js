import { api } from "../axios";
const prefix = "/products";

const getAll = async (page = 1, limit = 150) => {
  const axios = await api();
  return await axios.get(`${prefix}?_page=${page}&_limit=${limit}`).then(res => res.data);
};

const getByID = async (id) => {
  const axios = await api();
  return await axios.get(`${prefix}/${id}`).then((res) => res.data);
};

const getSearch = async (textSearch, page = 1, limit = 150) => {
  const axios = await api();
  return await axios.get(`${prefix}/?_page=${page}&_limit=${limit}&_search=${textSearch}`).then((res) => res.data);
};

export { getAll, getByID, getSearch }