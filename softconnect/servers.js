const Gerencianet = require('gn-api-sdk-node')

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
}
