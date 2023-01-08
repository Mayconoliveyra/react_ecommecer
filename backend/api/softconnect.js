const { SOFTCONNECT_API, SOFTCONNECT_KEY } = require("../.env")
const axios = require("axios")
const jwt = require("jwt-simple")

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const consultCEP = async (origins, destinations) => {
        const url = `/api/maps?origins=${origins}&destinations=${destinations}`
        const softconnect = await axios.create({
            baseURL: `${SOFTCONNECT_API}${url}`,
            headers: {
                "Authorization": `Bearer ${jwt.encode(app.store, SOFTCONNECT_KEY)}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });

        const endereco = await softconnect.get()
            .then((res) => res.data)
            .catch(() => false);
        if (!endereco) {
            return { error: 'Houve um erro, por favor tente novamente.' }
        }
        return endereco
    }

    const sendEmail = async (destination, title, body) => {
        const url = `/api/sandemail`
        const softconnect = axios.create({
            baseURL: `${SOFTCONNECT_API}${url}`,
            headers: {
                "Authorization": `Bearer ${jwt.encode(app.store, SOFTCONNECT_KEY)}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });

        const endereco = await softconnect.get()
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
