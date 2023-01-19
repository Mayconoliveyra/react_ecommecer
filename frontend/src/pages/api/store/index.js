import { api } from "../axios";

const get = async () => {
  const axios = await api();
  const url = "/store"
  return await axios.get(url);
};

export { get }