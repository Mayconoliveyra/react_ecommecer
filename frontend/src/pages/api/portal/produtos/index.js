import { apiPortal } from "../../axios";
const prefix = "portal/produtos";

const getProdutoPortal = async ({ id, _page = 1, _limit = 20, _sort = "id", _order = "DESC" }) => {
  const axios = await apiPortal();
  if (id) {
    return await axios.get(`${prefix}/${id}`).then(res => res.data);
  }
  return await axios.get(`${prefix}?_page=${_page}&_limit=${_limit}&_sort=${_sort}&_order=${_order}`).then(res => res.data);
};
const saveProdutoPortal = async (data, id) => {
  const axios = await apiPortal();
  if (id) {
    return await axios.put(`${prefix}/${id}`, data).then(res => res.data);
  }
  return await axios.post(`${prefix}`, data).then(res => res.data);
};


export { getProdutoPortal, saveProdutoPortal }