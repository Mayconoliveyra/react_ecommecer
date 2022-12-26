import api from "../axios";

export const storeNextAut = async (session) => {
  return await api.post(`signin-next-auth`, session).then(res => res.data);
};

