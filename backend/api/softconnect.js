const { SOFTCONNECT_API, SOFTCONNECT_KEY, SOFTCONNECT_ID, SOFTCONNECT_SECRET, EMAIL_MAILE } = require("../.env")
const axios = require("axios")
const nodemailer = require('nodemailer');
const jwt = require("jwt-simple")

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const data = Math.floor(Date.now() / 1000)
    const payload = {
        id: SOFTCONNECT_ID,
        secret: SOFTCONNECT_SECRET,
        iat: data, // emitido em,
        exp: data + (60 * 60 * 24 * 90) //(60segundos x 60 minutos x 24horas x 90 dias)
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
        try {
            const store = app.db("store").select().first()
            existOrError(store, { 400: "A empresa não cadastradas." })
            existOrError(store.email, { 400: "O email da empresa não foi encontrado" })

            /* Configuração do email */
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'softconnectecnologia@gmail.com',
                    pass: 'rtrbfimmlovhoapd'
                }
            })

            await transporter.sendMail({
                from: EMAIL_MAILE.from,
                to: destination,
                subject: title,
                html: body
            })
                .then((res) => console.log(res))
                .catch(error => {
                    utility_console("utilities.sendEmail", error)
                    return false
                })

        } catch (error) {
            utility_console("utilities.sendEmail", error)
            return { error: error }
        }
    }

    return {
        consultCEP,
        sendEmail,
    };
};
