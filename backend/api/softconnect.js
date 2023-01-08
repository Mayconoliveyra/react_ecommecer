const { SOFTCONNECT_API, SOFTCONNECT_KEY } = require("../.env")
const axios = require("axios")
const jwt = require("jwt-simple")

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const consultCEP = async (cep_destination) => {
        const url = `/api/maps?destination=${cep_destination}`
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

    /* Envio de email não é de forma assincrono */
    const sendEmail = ({ email, title, body, template = false }) => {
        try {
            const url = `/api/sandemail`
            const softconnect = axios.create({
                baseURL: `${SOFTCONNECT_API}`,
                headers: {
                    "Authorization": `Bearer ${jwt.encode(app.store, SOFTCONNECT_KEY)}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
            /* Envio de email não é de forma assincrono */
            softconnect.post(url, { email, title, body, template })
        } catch (error) {
            utility_console("softconnect.sendEmail", error)
            return
        }
    }

    return {
        consultCEP,
        sendEmail,
    };
};
