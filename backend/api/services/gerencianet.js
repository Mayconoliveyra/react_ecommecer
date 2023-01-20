/* const { GerencianetST } = require('../servers') */

/* const Gerencianet = require('gn-api-sdk-node')

const GerencianetST = (gt_client_id, gt_client_secret) => {
    const options = {
        sandbox: false,
        client_id: gt_client_id,
        client_secret: gt_client_secret,
        certificate: './certs/producao-softconnect.p12',
    }
    return new Gerencianet(options)
}

module.exports = {
    GerencianetST
} */

module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;

   /*  const createPixImmediate = async (req, res) => {
        const gerencianet = await GerencianetST(app.store.gt_client_id, app.store.gt_client_secret)

        const body = {
            calendario: {
                expiracao: 3600,
            },
            devedor: {
                cpf: '18765777034',
                nome: 'Maycon Oliveira',
            },
            valor: {
                original: "0.10",
            },
            chave: 'softconnect.tecnologia@gmail.com',
            infoAdicionais: [
                {
                    nome: 'Pagamento em',
                    valor: 'CAZIMI CONSTRUÇÃO',
                },
                {
                    nome: 'Pedido',
                    valor: '156',
                },
            ],
        }

        const pixImmediate = await gerencianet.pixCreateImmediateCharge([], body)
        console.log(pixImmediate.loc.id)

        await gerencianet.pixGenerateQRCode({ id: pixImmediate.loc.id })
            .then((resposta) => {
                console.log(resposta)
            })
            .catch((error) => {
                console.log(error)
            })

    }; */

  /*   const consultPixList = async (req, res) => {

        const gerencianet = new Gerencianet(options)

        const pixList = await gerencianet.pixListCharges({
            inicio: '2022-01-22T16:01:35Z',
            fim: '2023-11-30T20:10:00Z',
        })
        console.log(JSON.stringify(pixList))
    }; */

    /* pixListCharges, retornar informações, mas nao tem os totais */
 /*    return { createPixImmediate, consultPixList }; */
};
