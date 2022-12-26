import api from "../api";

export const storeNextAut = async (session) => {
  return await api.post(`login-auth`, session).then(res => res.data);
};

