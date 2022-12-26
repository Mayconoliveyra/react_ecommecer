import api from "../axios";

const prefix = "/store";

export const get = async () => {
  return await api.get(prefix).then((res) => res.data);
};