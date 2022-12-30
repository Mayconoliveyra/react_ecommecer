import api from "../axios";

const prefix = "/cart";

export const getCartTemp = async (idStorage) => {
  if (idStorage) {
    return await api.get(`${prefix}/${idStorage}`).then(res => res.data);
  } else {
    const id_storage = JSON.parse(localStorage.getItem("myCartId"))
    return await api.get(`${prefix}/${id_storage}`).then(res => res.data);
  }
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