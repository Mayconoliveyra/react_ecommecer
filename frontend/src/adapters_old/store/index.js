import api from "../api";

const prefix = "/store";

export const get = async () => {
  return await api.get(prefix);
};