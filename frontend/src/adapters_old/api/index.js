import axios from "axios";

const baseURL = "http://10.0.0.200:3030"
const token = typeof window !== 'undefined' && localStorage && localStorage.getItem("access_token") ? localStorage.getItem("access_token") : '';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

export default api;
