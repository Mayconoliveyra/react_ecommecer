const Gerencianet = require('gn-api-sdk-node')

const GerencianetST = (gt_client_id, gt_client_secret) => {
    const options = {
        sandbox: true,
        client_id: gt_client_id,
        client_secret: gt_client_secret,
        certificate: './certs/homologacao-softconnect.p12',
        /* certificate: './certs/producao-softconnect.p12', */
    }
    return new Gerencianet(options)
}

module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;

    const createPixImmediate = async ({ original, nmr_pedido }) => {
        try {
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
                    original: original.toString(),
                },
                chave: 'softconnect.tecnologia@gmail.com',
                infoAdicionais: [
                    {
                        nome: 'Estabelecimento Comercial:',
                        valor: app.store.nome,
                    },
                    {
                        nome: 'Número do pedido:',
                        valor: nmr_pedido.toString(),
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

        } catch (error) {

        }


    };

    /*  const consultPixList = async (req, res) => {
 
         const gerencianet = new Gerencianet(options)
 
         const pixList = await gerencianet.pixListCharges({
             inicio: '2022-01-22T16:01:35Z',
             fim: '2023-11-30T20:10:00Z',
         })
         console.log(JSON.stringify(pixList))
     }; */

    /* pixListCharges, retornar informações, mas nao tem os totais */
    return { createPixImmediate };
};
