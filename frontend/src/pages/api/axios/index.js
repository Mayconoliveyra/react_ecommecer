const { API_URL, API_PORT, CLIENT_KEY, SOFTCONNECT_ID, SOFTCONNECT_SECRET } = require("../../../../.env");
import axios from "axios";
const jwt = require("jwt-simple")

const payload = {
  id: SOFTCONNECT_ID,
  secret: SOFTCONNECT_SECRET,
}

const api = axios.create({
  baseURL: `${API_URL}${API_PORT}`,
  headers: {
    "Authorization": `Bearer ${jwt.encode(payload, CLIENT_KEY)}`,
    "Access-Control-Allow-Origin": "*"
  },
});

export default api;
