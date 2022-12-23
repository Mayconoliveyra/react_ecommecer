import api from "../api";

const prefix = "/cart";


export const getCartTemp = async () => {
  const id_storage = JSON.parse(localStorage.getItem("myCartId"))
  return await api.get(`${prefix}/${id_storage}`).then(res => res.data);
};

export const storeQuantity = async (id, quantity) => {
  const id_storage = JSON.parse(localStorage.getItem("myCartId"))
  const data = {
    id_storage: id_storage,
    id_product: id,
    quantity: quantity
  }

  return await api.post(`${prefix}`, data);
};

export const cartLocalStorage = async (id, quantity) => {
  const myCartStorage = JSON.parse(localStorage.getItem("myCart")) ?? [];

  /* Se a mercadoria que ta sendo adicionada ao carrinho ja tiver contida, sera removida para ser adicionada novamente */
  /* Isso evita que a mercadoria seja adicionada duplicada ao carrinho */
  const newMyCartStorage = myCartStorage.filter((item) => item.id != id)

  /* Se tiver setado id e quantity significa que ta sendo adicionado uma nova mercadoria no carrinho */
  if (id && quantity) newMyCartStorage.push({ id, quantity })

  const newMyCartStorage2 = newMyCartStorage.map((item) => [item.id, item.quantity])
  const dataCart = await getCartTemp(JSON.stringify(newMyCartStorage2)).then((res) => res.data)
  localStorage.setItem('myCart', JSON.stringify(dataCart))

  return await dataCart
};