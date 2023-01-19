module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const get = async (req, res) => {
        const store = app.store
        if (!store) return res.json({ error: msgErrorDefault })

        const modelo = {
            nome: store.nome,
            cpf: store.cpf,
            cnpj: store.cnpj,
            url_logo: store.url_logo,
            percentual_frete: store.percentual_frete,
            valor_minimo: store.valor_minimo,
            cep: store.cep,
            logradouro: store.logradouro,
            bairro: store.bairro,
            localidade: store.localidade,
            uf: store.uf,
            numero: store.numero,
            a_whatsapp: store.a_whatsapp,
            a_messenger: store.a_messenger,
            a_instagram: store.a_instagram,
            a_email: store.a_email,
            m_facebook: store.m_facebook,
            m_instagram: store.m_instagram,
            m_twitter: store.m_twitter,
            m_yutube: store.m_yutube
        }

        return res.json(modelo)
    };

    return { get };
};
