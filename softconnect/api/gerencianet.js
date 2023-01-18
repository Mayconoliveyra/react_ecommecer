const Gerencianet = require('gn-api-sdk-node')
const options = require('../credentials')

module.exports = (app) => {
    const { utility_console, msgErrorDefault } = app.api.utilities;

    const createPixImmediate = async (req, res) => {
        const gerencianet = new Gerencianet(options)

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

    };

    const consultPixList = async (req, res) => {

        const gerencianet = new Gerencianet(options)

        const pixList = await gerencianet.pixListCharges({
            inicio: '2022-01-22T16:01:35Z',
            fim: '2023-11-30T20:10:00Z',
        })
        console.log(JSON.stringify(pixList))
    };

    /* pixListCharges, retornar informações, mas nao tem os totais */
    return { createPixImmediate, consultPixList };
};
