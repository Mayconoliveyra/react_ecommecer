const { KEY_MAPS } = require("../.env")
const axios = require("axios")

module.exports = (app) => {
    const { existOrError, utility_console } = app.api.utilities;

    /*  Se houver erro será retornado dentro do { error: ... } */
    const consultCEP = async (req, res) => {
        /* CEP DE ORIGEM */
        const origin = app.store.cep
        /* CEP DESTINO */
        const destination = req.query.destination

        try {
            existOrError(origin, { 400: "CEP de origem deve ser informado." })
            existOrError(destination, { cep: "CEP deve ser informado." })
            if (origin.length != 9) throw { 400: "CEP de origem deve ter 9 digitos. recebido: " + origin };
            if (destination.length != 9) throw { cep: "CEP deve ter 9 digitos. recebido: " + destination };
        } catch (error) {
            utility_console("maps.consultCEP", error);
            return res.json({ error: error });
        }

        try {
            /* Verifica se já existe o cadastro na base(CEP_origem x CEP_destino) */
            let enderecoFromDb = await app.db
                .select("ad.id_cep_destino as cep", "address.logradouro", "address.bairro", "address.localidade", "address.uf", "ad.distancia", "ad.tempo")
                .table("address")
                .join('address_distance AS ad', 'address.cep', '=', 'ad.id_cep_destino')
                .where({ 'ad.id_cep_origem': origin, 'ad.id_cep_destino': destination })
                .first()

            /* Se a consulta anterior não retornar nada eu inverto os paramentros */
            /* O resulta final será o mesmo, pois a distancia do ponto e a mesma. */
            if (!enderecoFromDb)
                enderecoFromDb = await app.db
                    .select("ad.id_cep_destino as cep", "address.logradouro", "address.bairro", "address.localidade", "address.uf", "ad.distancia", "ad.tempo")
                    .table("address")
                    .join('address_distance AS ad', 'address.cep', '=', 'ad.id_cep_destino')
                    .where({ 'ad.id_cep_origem': destination, 'ad.id_cep_destino': origin })
                    .first()

            /* Se já tiver cadastrado retornar o endereço com as informaçõs completas */
            if (enderecoFromDb) {
                return res.json(enderecoFromDb);
            } else {
                /*cepOrigem e cepDestino: Se retornar = FALSE, signigica que o endereço não foi encontrado em nenhum lugar(base e api)*/
                const cepOrigem = await insertNewCEP(origin)
                const cepDestino = await insertNewCEP(destination)
                if (!cepOrigem) throw { 400: "O CEP de origem não foi encontrado. Por favor, procure o atendimento." }
                if (!cepDestino) throw { cep: "CEP não encontrado." }

                /* resultDistance, já consulta a distancia e retornar o objeto com os dados para ser retornado para o cliente.  */
                const resultEndereco = await resultDistance(origin, destination)

                if (!resultEndereco) throw { cep: "CEP não encontrado." }
                return res.json(resultEndereco);
            }
        } catch (error) {
            utility_console("maps.consultCEP", JSON.stringify(error) + " CEP:" + destination);
            return res.json({ error: error });
        }
    }
    async function insertNewCEP(cep) {
        try {
            const endereco = await app.db
                .select("cep", "logradouro", "bairro", "localidade", "uf")
                .table("address")
                .where({ cep: cep })
                .first()

            /* Se exitir na base ja retornar os dados */
            if (endereco) return endereco

            /* Se o endereço nao existir consulta na api ViaCep */
            const urlApiViaCep = `https://viacep.com.br/ws/${cep}/json`
            const enderecoViaCep = await axios.get(urlApiViaCep)
                .then(res => {
                    /* Se o cep nao for encontrado retornar false */
                    if (res.data.erro) return false

                    return {
                        cep: cep,
                        logradouro: res.data.logradouro,
                        bairro: res.data.bairro,
                        localidade: res.data.localidade,
                        uf: res.data.uf,
                        api_via: true
                    }
                })
                .catch(() => false); /* Se der erro retornar false */

            /* Se for encontrado no viacep realiza o cadastro na base softconnect*/
            if (enderecoViaCep)
                await app.db("address")
                    .insert(enderecoViaCep)
                    .then()
                    .catch((error) => {
                        utility_console("maps.insertNewCEP", error);
                        return
                    });

            /* Se retornar False significa que o endereço não foi encontrado */
            return enderecoViaCep

        } catch (error) {
            utility_console("maps.insertNewCEP", error);
            return false
        }
    }
    async function resultDistance(origin, destination) {
        try {
            existOrError(origin, "origin não pode ser nulo")
            existOrError(destination, "destination não pode ser nulo")
            if (origin.length != 9) throw "CEP tem que 9 digitios. recebido: " + origin;
            if (destination.length != 9) throw "destination tem que 9 digitios. recebido: " + destination;
        } catch (error) {
            utility_console("maps.resultDistance", error);
            return false;
        }

        try {
            const origem = await insertNewCEP(origin)
            const destino = await insertNewCEP(destination)
            existOrError(origem, "origem não pode ser nulo")
            existOrError(destino, "destino não pode ser nulo")

            const origemParams = `${origem.logradouro}, ${origem.bairro}, ${origem.localidade} - ${origem.uf}, ${origem.cep}`
            const destinoParams = `${destino.logradouro}, ${destino.bairro}, ${destino.localidade} - ${destino.uf}, ${destino.cep}`

            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origemParams}&destinations=${destinoParams}&key=${KEY_MAPS}`
            const newEndereco = await axios.get(url)
                .then((res) => {
                    const status = res.data && res.data.rows && res.data.rows[0].elements[0] && res.data.rows[0].elements[0].status

                    if (status && status == 'OK') {
                        const distancia = res.data.rows[0].elements[0].distance.value
                        const duracao = res.data.rows[0].elements[0].duration.value

                        return {
                            distancia: distancia,
                            tempo: duracao,
                            api_maps: true
                        }
                    }

                    return {
                        distancia: 0,
                        tempo: 0,
                        api_maps: false
                    }
                })
                .catch((error) => {
                    utility_console("maps.resultDistance", error);
                    return {
                        distancia: 0,
                        tempo: 0,
                        api_maps: false
                    }
                });

            if (newEndereco)
                await app.db("address_distance")
                    .insert({ ...newEndereco, id_cep_origem: origin, id_cep_destino: destination })
                    .then()
                    .catch((error) => {
                        utility_console("maps.insertDistance", error);
                        return
                    });

            delete newEndereco.api_maps
            return { ...newEndereco, ...destino };
        } catch (error) {
            utility_console("maps.resultDistance", error);
            return false;
        }
    }

    return { consultCEP };
};
