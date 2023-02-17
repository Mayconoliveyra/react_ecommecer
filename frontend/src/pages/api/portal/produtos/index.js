import { apiPortal } from "../../axios";
const prefix = "portal/produtos";

const getAllPortal = async ({ id, page = 1, limit = 150 }) => {
  const axios = await apiPortal();
  if (id) {
    return await axios.get(`${prefix}/${id}`).then(res => res.data);
  }
  return await axios.get(`${prefix}?_page=${page}&_limit=${limit}`).then(res => res.data);
};
const saveProdutoPortal = async (data) => {
  const axios = await apiPortal();
  return await axios.post(`${prefix}`, data).then(res => res.data);
};


export { getAllPortal, saveProdutoPortal }