import axios from "axios";

const token = typeof window !== 'undefined' && localStorage && localStorage.getItem("access_token") ? localStorage.getItem("access_token") : '';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL ?? "http://10.0.0.200:3030"}`,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

export default api;
