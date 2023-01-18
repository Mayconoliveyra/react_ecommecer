const { SOFTCONNECT_API, SOFTCONNECT_KEY } = require("../.env")
const axios = require("axios")
const jwt = require("jwt-simple")

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const softconnectAxios = () => {
        const data = Math.floor(Date.now() / 1000)
        const payload = {
            id: app.store.id,
            client_id: app.store.client_id,
            client_secret: app.store.client_secret,
            iat: data, // emitido em
            exp: data + (60 * 1) // 1 minutos 
        }
      /*   console.log(jwt.encode(payload, SOFTCONNECT_KEY)) */
        return axios.create({
            baseURL: `${SOFTCONNECT_API}`,
            headers: {
                "Authorization": `Bearer ${jwt.encode(payload, SOFTCONNECT_KEY)}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
        });
    }

    const store = async () => {
        try {
            const softconnect = await softconnectAxios();
            const url = `/api/store`

            const store = await softconnect.get(url)
                .then((res) => res.data)
                .catch(() => false);

            console.log(store)
            if (!store) {
                return { error: msgErrorDefault }
            }
            return store
        } catch (error) {
            utility_console("softconnect.store", error)
            return { error: msgErrorDefault }
        }
    }

    const consultCEP = async (cep_destination) => {
        try {
            const softconnect = await softconnectAxios();
            const url = `/api/maps?destination=${cep_destination}`

            const endereco = await softconnect.get(url)
                .then((res) => res.data)
                .catch(() => false);
            if (!endereco) {
                return { error: 'Houve um erro, por favor tente novamente.' }
            }
            return endereco
        } catch (error) {
            utility_console("softconnect.consultCEP", error)
            return { error: msgErrorDefault }
        }
    }

    /* Envio de email não é de forma assincrono */
    const sendEmail = async ({ email, title, body, template = false }) => {
        try {
            const softconnect = await softconnectAxios();

            const url = `/api/sandemail`
            /* Envio de email não é de forma assincrono */
            softconnect.post(url, { email, title, body, template })
        } catch (error) {
            utility_console("softconnect.sendEmail", error)
            return { error: msgErrorDefault }
        }
    }

    return {
        store,
        consultCEP,
        sendEmail,
    };
};
