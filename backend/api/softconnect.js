module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const consultCEP = async (cep_destination) => {
        try {
            const softconnect = await SoftconnectAPI();
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
            const softconnect = await SoftconnectAPI();

            const url = `/api/sandemail`
            /* Envio de email não é de forma assincrono */
            softconnect.post(url, { email, title, body, template })
        } catch (error) {
            utility_console("softconnect.sendEmail", error)
            return { error: msgErrorDefault }
        }
    }

    return {
        consultCEP,
        sendEmail,
    };
};
