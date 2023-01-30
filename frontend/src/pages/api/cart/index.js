import { api } from "../axios";
const prefix = "/cart";

const getCartTemp = async ({ id_storage, id_user, session }) => {
  const axios = await api(session);
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  if (id_user)
    /* Quando chama o "/usuario", vai retorar frete. pega os dados do usuario no userAuth no backend */
    return await axios.get(`${prefix}/usuario/${id_storage}`).then(res => res.data);

  return await axios.get(`${prefix}/${id_storage}`).then(res => res.data);
};

const storeQuantity = async (id, quantity, id_storage) => {
  const axios = await api();
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  const data = {
    id_storage: id_storage,
    id_product: id,
    quantity: quantity
  }

  return await axios.post(`${prefix}`, data);
};

const storePedido = async (data, session) => {
  const axios = await api(session);
  return await axios.post(`${prefix}/save-pedido`, data).then((res) => res.data);;
};

const getPedidos = async ({ id_sales, page, limi, session }) => {
  const axios = await api(session);
  if (id_sales)
    return await axios.get(`${prefix}/meus-pedidos/${id_sales}`).then(res => res.data);
  return await axios.get(`${prefix}/meus-pedidos/null/?_page=${page}&_limit=${limi}`).then(res => res.data);
};

const storePixPgt = async (id_sale, session) => {
  const axios = await api(session);
  return await axios.get(`${prefix}/pix-detalhes/${id_sale}`).then((res) => res.data);;
};

export { getCartTemp, storeQuantity, storePedido, getPedidos, storePixPgt }