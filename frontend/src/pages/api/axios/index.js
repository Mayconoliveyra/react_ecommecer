const { TOKEN_KEY } = require("../../../../.env");
const { ID, CLIENT_ID, CLIENT_SECRET, URL_SERVER } = require("../../../../client");
import axios from "axios";
const jwt = require("jwt-simple")

const data = Math.floor(Date.now() / 1000)
const payload = {
  id: ID,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  iat: data,
  exp: data + (60 * 1) // 1 minutos 
}
const api = () => {
  return axios.create({
    baseURL: URL_SERVER,
    headers: {
      "Authorization": `Bearer ${jwt.encode(payload, TOKEN_KEY)}`,
      "Access-Control-Allow-Origin": "*"
    },
  })
};

export { api };
