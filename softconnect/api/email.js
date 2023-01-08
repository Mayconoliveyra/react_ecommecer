const { EMAIL_MAILE } = require("../.env")

module.exports = (app) => {
    const { existOrError, utility_console } = app.api.utilities;

    /*  Se houver erro será retornado dentro do { error: ... } */
    const sendEmail = async (req, res) => {
        console.log(req.user)
        try {
            const store = app.db("store").select().first()
            existOrError(store, { 400: "A empresa não cadastradas." })
            existOrError(store.email, { 400: "O email da empresa não foi encontrado" })

            /* Valida se a empresa tem um email especifico configurado. */
            /* Se algum dos campos tiver vazio utiliza o email padrão(id: 1) */
            const emailConfig = true
            if (!req.user.config_email_name) emailConfig = false
            if (!req.user.config_email_user) emailConfig = false
            if (!req.user.config_email_pass) emailConfig = false
            if (!req.user.config_email_host) emailConfig = false
            if (!req.user.config_email_port) emailConfig = false
            if (!req.user.config_email_secure) emailConfig = false

            /* Configuração padrão de email */
            let transporter = nodemailer.createTransport({
                host: EMAIL_MAILE.config.host,
                port: EMAIL_MAILE.config.port,
                secure: EMAIL_MAILE.config.secure,
                auth: {
                    user: EMAIL_MAILE.auth.user,
                    pass: EMAIL_MAILE.auth.pass
                }
            })

            if (emailConfig) {
                transporter = nodemailer.createTransport({
                    host: EMAIL_MAILE.config.host,
                    port: EMAIL_MAILE.config.port,
                    secure: EMAIL_MAILE.config.secure,
                    auth: {
                        user: EMAIL_MAILE.auth.user,
                        pass: EMAIL_MAILE.auth.pass
                    }
                })
            }

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
