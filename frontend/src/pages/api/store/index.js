import { api } from "../axios";
const prefix = "/store";

const get = async () => {
  const axios = await api();
  return await axios.get(prefix);
};

export { get }