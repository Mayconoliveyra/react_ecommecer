import axios from "axios";

const baseURL = "http://10.0.0.200:3030"
const api = axios.create({
  baseURL: baseURL
});

export default api;
