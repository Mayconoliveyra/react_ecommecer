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

const storeQuantidade = async (id, quantidade, id_storage) => {
  const axios = await api();
  if (!id_storage) return console.log("[id_storage] NÃO FOI INFORMADO!!")

  const data = {
    id_storage: id_storage,
    id_produto: id,
    quantidade: quantidade
  }

  return await axios.post(`${prefix}`, data);
};

const storePedido = async (data, session) => {
  const axios = await api(session);
  return await axios.post(`${prefix}/save-pedido`, data).then((res) => res.data);;
};

const getPedidos = async ({ id_vendas, page, limi, session }) => {
  const axios = await api(session);
  if (id_vendas)
    return await axios.get(`${prefix}/meus-pedidos/${id_vendas}`).then(res => res.data);
  return await axios.get(`${prefix}/meus-pedidos/null/?_page=${page}&_limit=${limi}`).then(res => res.data);
};

const storePixPgt = async (id_venda, session) => {
  const axios = await api(session);
  return await axios.get(`${prefix}/pix-detalhes/${id_venda}`).then((res) => res.data);;
};

export { getCartTemp, storeQuantidade, storePedido, getPedidos, storePixPgt }