const { SOFTCONNECT_API, SOFTCONNECT_KEY } = require("../.env")
const { ID, CLIENT_ID, CLIENT_SECRET } = require("../client");
const axios = require("axios")
const jwt = require("jwt-simple")

const SoftconnectAPI = () => {
    const data = Math.floor(Date.now() / 1000)
    const payload = {
        id: ID,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        iat: data, // emitido em
        exp: data + (60 * 60) // 1 minuto  */ 
    }

    console.log(jwt.encode(payload, SOFTCONNECT_KEY))
    return axios.create({
        baseURL: `${SOFTCONNECT_API}`,
        headers: {
            "Authorization": `Bearer ${jwt.encode(payload, SOFTCONNECT_KEY)}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
}

module.exports = {
    SoftconnectAPI
}
