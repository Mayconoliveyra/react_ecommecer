const { URL_SERVER, SECRET_KEY_SERVER } = require("../../../../.env");
const { ID, CLIENT_ID, CLIENT_SECRET } = require("../../../../client");
import axios from "axios";
const jwt = require("jwt-simple")

const api = () => {
  const data = Math.floor(Date.now() / 1000)
  const payload = {
    id: ID,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    iat: data,
    exp: data + (60 * 1) // 1min
  }

  return axios.create({
    baseURL: URL_SERVER,
    headers: {
      "Authorization": `Bearer ${jwt.encode(payload, SECRET_KEY_SERVER)}`,
      "Access-Control-Allow-Origin": "*"
    },
  })
};

export { api };
