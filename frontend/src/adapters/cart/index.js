import api from "../API";

const prefix = "/cart";

export const getCartProducts = async (myCartStorage = '[]') => {
  return await api.get(`${prefix}?_mycart=${myCartStorage}`);
};
