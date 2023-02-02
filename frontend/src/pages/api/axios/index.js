import axios from "axios";
const jwt = require("jwt-simple")

const api = (session = {}) => {
  const data = Math.floor(Date.now() / 1000)
  const payload = {
    id: process.env.ID,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    iat: data,
    exp: data + (30),
    /* exp: data + (60 * 60 * 24 * 30) */
  }
  const payloadSession = {
    ...session,
    iat: data,
    exp: data + (30)
  }
  return axios.create({
    baseURL: process.env.URL_SERVER,
    headers: {
      "Authorization": `Bearer ${jwt.encode(payload, process.env.SECRET_KEY_SERVER)}`,
      "Access-Control-Allow-Origin": "*",
      "userauth": jwt.encode(payloadSession, process.env.SECRET_KEY_AUTH)
    },
  })
};

export { api };
