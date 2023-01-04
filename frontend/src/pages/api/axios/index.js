const { REACT_APP_API_URL } = require("../../../../.env");
import axios from "axios";

const token = typeof window !== 'undefined' && localStorage && localStorage.getItem("access_token") ? localStorage.getItem("access_token") : '';

const api = axios.create({
  baseURL: `${REACT_APP_API_URL}`,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

export default api;
