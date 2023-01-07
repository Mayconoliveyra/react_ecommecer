const { KEY_MAPS } = require("../.env")
const axios = require("axios")

module.exports = (app) => {
    const { existOrError, utility_console } = app.api.utilities;

    /*  Se houver erro será retornado dentro do { error: ... } */
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

    return { sendEmail };
};
