const CryptoJS = require("crypto-js");

const SEGREDO_CRIPTOFRAFIA =
    "qQaZSaCVZoEkLBiF5zBhg6G5KWfhD9s-ZooQjzQko94"; /* Não pode ser alterada se já foi utilizada, poís, vai dar erro para descriptografar*/

module.exports = (app) => {
    const msgErrorDefault =
        "Não foi possível realizar a operação!. Por favor, atualize a página e tente novamente.";
    function existeOuErro(value, msg) {
        if (!value) throw msg;
        if (Array.isArray(value) && value.length === 0) throw msg;
        if (typeof value === "string" && !value.trim()) throw msg;
    }
    function notExistOrError(value, msg) {
        try {
            existeOuErro(value, msg);
        } catch (msg) {
            return;
        }
        throw msg;
    }

    async function notExistOrErrorDB({ table, column, data, id }, msg) {
        const dataDB = await app.db.raw(`
        SELECT * FROM 
        ${table} 
        WHERE ${column} = '${data}' 
        AND id != '${id}'`)

        notExistOrError(dataDB[0], msg)
        return
    }

    async function naoExisteNoBancoOuErro(
        nomeTabelaBD,
        nomeColunaBD,
        reqBody,
        msg
    ) {
        const noBanco = await app
            .db(nomeTabelaBD)
            .where(`${nomeColunaBD}`, "=", `${reqBody}`)
            .first();
        if (noBanco) throw msg;
    }
    async function existeNoBancoOuErro(
        nomeTabelaBD,
        nomeColunaBD,
        reqBody,
        msg
    ) {
        const noBanco = await app
            .db(nomeTabelaBD)
            .where(`${nomeColunaBD}`, "=", `${reqBody}`)
            .first();
        if (!noBanco) throw msg;
        return noBanco;
    }
    function dataAtualFormatadaBR() {
        var data = new Date(),
            dia = data.getDate().toString().padStart(2, "0"),
            mes = (data.getMonth() + 1).toString().padStart(2, "0"), //+1 pois no getMonth Janeiro começa com zero.
            ano = data.getFullYear(),
            hra = data.getHours().toString().padStart(2, "0"),
            mnt = data.getMinutes().toString().padStart(2, "0"),
            seg = data.getSeconds().toString().padStart(2, "0");
        return `${dia}/${mes}/${ano} ${hra}:${mnt}:${seg}`;
    }

    function criptografar(texto) {
        const encryptText = CryptoJS.AES.encrypt(
            texto,
            SEGREDO_CRIPTOFRAFIA
        ).toString();
        return encryptText;
    }

    function descriptografar(texto) {
        const bytes = CryptoJS.AES.decrypt(texto, SEGREDO_CRIPTOFRAFIA);
        const decryptText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptText;
    }

    function utility_console({
        name = null,
        type = null,
        message = null,
        error = null,
        saveDB = true,
    }) {
        console.log("########################################")
        console.log(`Function: ${name} // type: ${type} // message: ${message}`);
        console.log(error);
        console.log("########################################")
        /* Salva no banco de dados */
        if (saveDB) {
            const moodelo = {
                name: name,
                type: type,
                message: message,
                error: String(error),
            };

            app.db
                .insert(moodelo)
                .table("_error_backend")
                .then()
                .catch((error) =>
                    console.log("Utility_console: " + error)
                );
        }
    }

    function contatoValidoOuErro(telefone, msg) {
        //retira todos os caracteres menos os numeros
        telefone = telefone.replace(/\D/g, "");

        //verifica se tem a qtde de numero correto
        if (!(telefone.length >= 10 && telefone.length <= 11)) throw msg;

        //Se tiver 11 caracteres, verificar se começa com 9 o contato
        if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9)
            throw msg;

        //verifica se não é nenhum numero digitado errado (propositalmente)
        for (var n = 0; n < 10; n++) {
            //um for de 0 a 9.
            //estou utilizando o metodo Array(q+1).join(n) onde "q" é a quantidade e n é o
            //caractere a ser repetido
            if (
                telefone == new Array(11).join(n) ||
                telefone == new Array(12).join(n)
            )
                throw msg;
        }
        //DDDs validos
        var codigosDDD = [
            11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33,
            34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55,
            61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82,
            83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
        ];
        //verifica se o DDD é valido (sim, da pra verificar rsrsrs)
        if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1)
            throw msg;

        //se passar por todas as validações acima, então está tudo certo
    }

    function formatBody(reqBody) {
        let bodyReturn = {};
        Object.keys(reqBody).forEach(key => {
            bodyReturn = { [key]: reqBody[key] ? reqBody[key] : null, ...bodyReturn }
        });
        return bodyReturn
    }

    function removeAll(valor) {
        return valor.normalize("NFD")
            .replace(/[^a-zA-Z0-9s]/g, "");
    }

    return {
        existeOuErro,
        notExistOrError,
        notExistOrErrorDB,
        naoExisteNoBancoOuErro,
        existeNoBancoOuErro,
        criptografar,
        descriptografar,
        utility_console,
        msgErrorDefault,
        dataAtualFormatadaBR,
        contatoValidoOuErro,
        formatBody,
        removeAll
    };
};
