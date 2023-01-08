const { SOFTCONNECT_API, SOFTCONNECT_KEY, SOFTCONNECT_ID, SOFTCONNECT_SECRET } = require("../.env")
const axios = require("axios")
const jwt = require("jwt-simple")

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const payload = {
        id: SOFTCONNECT_ID,
        secret: SOFTCONNECT_SECRET
    }

    const softconnect = axios.create({
        baseURL: `${SOFTCONNECT_API}`,
        headers: {
            "Authorization": `Bearer ${jwt.encode(payload, SOFTCONNECT_KEY)}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });

    const consultCEP = async (origins, destinations) => {
        const url = `/api/maps?origins=${origins}&destinations=${destinations}`

        const endereco = await softconnect.get(url)
            .then((res) => res.data)
            .catch(() => false);

        if (!endereco) {
            return { error: 'Houve um erro, por favor tente novamente.' }
        }
        return endereco
    }

    const sendEmail = async (destination, title, body) => {
        const url = `/api/sandemail`

        const endereco = await softconnect.get(url)
            .then((res) => res.data)
            .catch(() => false);

        if (!endereco) {
            return { error: 'Houve um erro, por favor tente novamente.' }
        }
        return endereco
    }

    return {
        consultCEP,
        sendEmail,
    };
};
