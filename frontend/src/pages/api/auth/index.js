import api from "../axios";

const prefix = "/user";

/* Alterar o cadastro */
const store = async (session) => {
  return await api.put(`${prefix}/${session.id}`, session).then(res => res.data);
};

const storeNextAut = async (session) => {
  return await api.post(`signin-next-auth`, session).then(res => res.data);
};

export { store, storeNextAut }