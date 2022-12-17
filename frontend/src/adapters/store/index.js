import api from "../API";

const prefix = "/store";

export const get = async () => {
  return await api.get(prefix);
};