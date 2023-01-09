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
            let email = {
                from: `"${store.nome} " <${store.config_email_user}>`,
                to: modelo.email,
                subject: modelo.title,
                html: modelo.body
            }

            switch (modelo.template) {
                case 'AUTHENTICATION':
                    email = {
                        ...email,
                        subject: 'Ativação de usuário',
                        html: AUTHENTICATION({ ...modelo, ...store })
                    }
                    break;

                default:
                    break;
            }

            transporter.sendMail(email)
                .then()
                .catch(error => {
                    utility_console("email.sendEmail", error)
                    return
                })
        } catch (error) {
            utility_console("email.sendEmail", error)
        }
    }

    const AUTHENTICATION = (params) => {
        return `
    <div style='text-align: center;'>
        <thead style='text-align: center;'>
        <img
            src=${params.url_logo}
            alt='logo_store'
            width='180px'
        />
        <hr />
        <h4>Olá, seja muito bem-vindo! <br>
        Falta pouco para você ativar sua conta</h4>
        <p>
            Clique no link abaixo para finalizar o processo de cadastro:
        </p>
        <b>
            <a href='${app.store.url_frontend}/conta/cadastrarsenha?authlogin=${params.body}'>Finalizar meu cadastro</a>
        </b>
        <br>
        <br>
        <br>
        <h4 style='margin-bottom: 5px;'>Atenção!</h4>
        <small>
            Se você não realizou esta solicitação, por favor ignore esta mensagem.
        </small>
        <br>
        <small>
            Caso tenha dúvidas, nos envie uma mensagem: <a href=mailto:${params.atendimento_email}>${params.atendimento_email}</a>
        </small>
        </thead>
    </div>
    `
    }
    return { sendEmail };
};
