import api from "../axios";

const prefix = "/store";

const get = async () => {
  return await api.get(prefix);
};

export { get }