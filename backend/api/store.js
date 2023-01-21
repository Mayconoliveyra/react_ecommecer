module.exports = (app) => {
    const get = async (req, res) => {
        const store = app.store
        const modelo = {
            nome: store.nome,
            cpf: store.cpf,
            cnpj: store.cnpj,
            url_logo: store.url_logo,
            cep: store.cep,
            logradouro: store.logradouro,
            bairro: store.bairro,
            localidade: store.localidade,
            uf: store.uf,
            numero: store.numero,
            cobrar_frete: store.cobrar_frete,
            percentual_frete: store.percentual_frete,
            taxa_min_frete: store.taxa_min_frete,
            vlr_min_pedido: store.vlr_min_pedido,
            distancia_max_frete: store.distancia_max_frete,
            entrega_frete: store.entrega_frete,
            entrega_retirada: store.entrega_retirada,
            pgt_pix: store.pgt_pix,
            pgt_cartao: store.pgt_cartao,
            pgt_loja: store.pgt_loja,
            pgt_entrega: store.pgt_entrega,
            a_whatsapp: store.a_whatsapp,
            a_messenger: store.a_messenger,
            a_instagram: store.a_instagram,
            a_email: store.a_email,
            m_facebook: store.m_facebook,
            m_instagram: store.m_instagram,
            m_twitter: store.m_twitter,
            m_yutube: store.m_yutube,
        }

        return res.json(modelo)
    };

    return { get };
};
