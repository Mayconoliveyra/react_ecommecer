import api from "../axios";

const prefix = "/cart";

export const getCartTemp = async (id_storage, id_user) => {
  /* Utilizado para finalizar venda, quando é passado a consulta tras o valor do frete. */
  const id_usuario = id_user ? `?id_user=${id_user}` : '';
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  return await api.get(`${prefix}/${id_storage}${id_usuario}`).then(res => res.data);
};

export const storeQuantity = async (id, quantity, id_storage) => {
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  const data = {
    id_storage: id_storage,
    id_product: id,
    quantity: quantity
  }

  return await api.post(`${prefix} `, data);
};