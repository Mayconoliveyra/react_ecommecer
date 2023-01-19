import { storeST } from "../axios";

const get = async () => {
  const axios = await storeST();
  return await axios.get();
};

export { get }