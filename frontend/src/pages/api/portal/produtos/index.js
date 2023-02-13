import { apiPortal } from "../../axios";
const prefix = "portal/produtos";

const getAllPortal = async (page = 1, limit = 150) => {
  const axios = await apiPortal();
  return await axios.get(`${prefix}?_page=${page}&_limit=${limit}`).then(res => res.data);
};


export { getAllPortal }