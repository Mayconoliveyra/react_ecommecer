import api from "../API";

const prefix = "/cart";

export const getCartProducts = async (myCartStorage) => {
  return await api.get(`${prefix}?_mycart=${myCartStorage}`);
};

export const cartLocalStorage = async (id, quantity) => {
  const myCartStorage = JSON.parse(localStorage.getItem("myCart")) ?? [];

  /* Se a mercadoria que ta sendo adicionada ao carrinho ja tiver contida, sera removida para ser adicionada novamente */
  /* Isso evita que a mercadoria seja adicionada duplicada ao carrinho */
  const newMyCartStorage = myCartStorage.filter((item) => item.id != id)

  /* Se tiver setado id e quantity significa que ta sendo adicionado uma nova mercadoria no carrinho */
  if (id && quantity) newMyCartStorage.push({ id, quantity })

  const dataCart = await getCartProducts(JSON.stringify(newMyCartStorage)).then((res) => res.data)
  localStorage.setItem('myCart', JSON.stringify(dataCart))

  return await dataCart
};