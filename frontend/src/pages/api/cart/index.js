import { api } from "../axios";
const prefix = "/cart";

const getCartTemp = async (id_storage, id_user, session) => {
  const axios = await api(session);
  /* Utilizado para finalizar venda, quando é passado a consulta tras o valor do frete. */
  const id_usuario = id_user ? `?id_user=${id_user}` : '';
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  return await axios.get(`${prefix}/${id_storage}${id_usuario}`).then(res => res.data);
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

const getPedidos = async ({ id, page, limi, id_sales, session }) => {
  const axios = await api(session);
  if (id_sales)
    return await axios.get(`${prefix}/meus-pedidos/${id}?id_sales=${id_sales}`).then(res => res.data);
  return await axios.get(`${prefix}/meus-pedidos/${id}?_page=${page}&_limit=${limi}`).then(res => res.data);
};

const storePixPgt = async (id, id_user, session) => {
  /* id = codigo do pedido;  id_user= codigo do usuario;*/
  const axios = await api(session);
  return await axios.get(`${prefix}/pix-detalhes/${id}?id_user=${id_user}`).then((res) => res.data);;
};

export { getCartTemp, storeQuantity, storePedido, getPedidos, storePixPgt }