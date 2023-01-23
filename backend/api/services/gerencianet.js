const { GN_CERTIFICATE } = require("../../.env")
const Gerencianet = require('gn-api-sdk-node')

const GerencianetST = (gt_client_id, gt_client_secret) => {
    const options = {
        sandbox: true, /* true= homologação; false = produção; */
        client_id: gt_client_id,
        client_secret: gt_client_secret,
        certificate: `./certs/${GN_CERTIFICATE}`,
    }
    return new Gerencianet(options)
}

module.exports = (app) => {
    const { utility_console, existOrError, msgErrorDefault } = app.api.utilities;

    const createPixImmediate = async ({ cpf, nome, original, nmr_pedido, expiracao = 1800 }) => {
        try {
            existOrError(cpf, "[cpf] não pode ser nulo.")
            existOrError(nome, "[nome] não pode ser nulo.")
            existOrError(original, "[original] não pode ser nulo ou 0.")
            existOrError(nmr_pedido, "[nmr_pedido] não pode ser nulo.")

            existOrError(app.store.gt_client_id, "[app.store.gt_client_id] não pode ser nulo.")
            existOrError(app.store.gt_client_secret, "[app.store.gt_client_secret] não pode ser nulo.")

            const gerencianet = await GerencianetST(app.store.gt_client_id, app.store.gt_client_secret)

            const body = {
                calendario: {
                    expiracao: expiracao,
                },
                devedor: {
                    cpf: cpf.replace(/\D/g, ''),
                    nome: nome,
                },
                valor: {
                    original: original.toFixed(2),
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

            /* Gera cobrança pix */
            const pixImmediate = await gerencianet.pixCreateImmediateCharge([], body)

            /* Gera cobrança qrcode(chave e data:image do qrcode) */
            const pix = await gerencianet.pixGenerateQRCode({ id: pixImmediate.loc.id })
            const data = new Date();
            let dataExp = new Date();
            dataExp.setMinutes(dataExp.getMinutes() + (expiracao / 60));
            const modeloPix = {
                pix_criacao: data,
                pix_expiracao: dataExp,
                pix_txid: pixImmediate.txid,
                pix_id: pixImmediate.loc.id,
                pix_tipo_cob: pixImmediate.loc.tipoCob,
                pix_status: pixImmediate.status,
                pix_chave: pixImmediate.chave,
                pix_pix: JSON.stringify(pixImmediate),
                pix_qrcode: pix.qrcode,
                pix_img_qrcode: pix.imagemQrcode,
            }

            /* Se o pix for gerado com sucesso, vai ser retornado  imagem do qrcode e a chave qrcode. */
            /* Caso contrario retornar erro não identificado. */
            if (modeloPix && modeloPix.pix_qrcode && modeloPix.pix_img_qrcode && modeloPix.pix_txid) {
                return modeloPix
            } else {
                /* se dentro de pix não tiver os parametros necessario retornar o objeto retornado */
                throw `Houve um erro não identificado para gerar o pix. pix: ${JSON.stringify(pix)}`
            }
        } catch (error) {
            throw `gerencianet.createPixImmediate: ${error}`
        }
    };
    const pixDetail = async (txid) => {
        try {
            existOrError(txid, "[txid] não pode ser nulo.")

            existOrError(app.store.gt_client_id, "[app.store.gt_client_id] não pode ser nulo.")
            existOrError(app.store.gt_client_secret, "[app.store.gt_client_secret] não pode ser nulo.")

            const gerencianet = await GerencianetST(app.store.gt_client_id, app.store.gt_client_secret)

            /* Consultar cobrança pix */
            const pixImmediate = await gerencianet.pixDetailCharge({ txid: txid })
            const modeloPix = {
                pix_txid: pixImmediate.txid,
                pix_id: pixImmediate.loc.id,
                pix_tipo_cob: pixImmediate.loc.tipoCob,
                pix_status: pixImmediate.status,
                pix_chave: pixImmediate.chave,
            }

            console.log(pixImmediate)
        } catch (error) {
            throw `gerencianet.pixDetail: ${error}`
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
    return { createPixImmediate, pixDetail };
};
