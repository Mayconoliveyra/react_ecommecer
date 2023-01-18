const { TOKEN_KEY } = require("../../../../.env");
const { ID, CLIENT_ID, CLIENT_SECRET, URL_SERVER } = require("../../../../client");
import axios from "axios";
const jwt = require("jwt-simple")

const payload = {
  id: ID,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
}

const api = axios.create({
  baseURL: URL_SERVER,
  headers: {
    "Authorization": `Bearer ${jwt.encode(payload, TOKEN_KEY)}`,
    "Access-Control-Allow-Origin": "*"
  },
});

export default api;
