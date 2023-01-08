
const nodemailer = require('nodemailer');

module.exports = (app) => {
    const { utility_console, existOrError } = app.api.utilities;

    /*  Se houver erro será retornado dentro do { error: ... } */
    const sendEmail = async (req, res) => {
        res.status(200).send()
        const store = app.store
        const modelo = {
            email: req.body.email,
            title: req.body.title,
            body: req.body.body,
            template: req.body.template,
        }
        try {
            existOrError(modelo.email, "email precisa ser informado.")
            if (!modelo.template) {
                existOrError(modelo.title, "title precisa ser informado.")
                existOrError(modelo.body, "body precisa ser informado.")
            }
            /* Configuração padrão de email */
            const transporter = nodemailer.createTransport({
                host: store.config_email_host,
                port: store.config_email_port,
                secure: store.config_email_secure,
                auth: {
                    user: store.config_email_user,
                    pass: store.config_email_pass
                }
            })
            transporter.sendMail({
                from: `"${store.nome} " <${store.config_email_user}>`,
                to: modelo.email,
                subject: modelo.title,
                html: modelo.body
            })
                .then((res) => console.log(res.response))
                .catch(error => {
                    utility_console("email.sendEmail", error)
                    return
                })

        } catch (error) {
            utility_console("email.sendEmail", error)
        }
    }

    return { sendEmail };
};
