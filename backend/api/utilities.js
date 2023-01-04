const { BASE_API_SOFTCONNECT, KEY_SOFTCONNECT } = require("../.env")
const CryptoJS = require("crypto-js");
const axios = require("axios")

const SECRET_ENCRYPT =
    "qQaZSaCVZoEkLBiF5zBhg6G5KWfhD9s-ZooQjzQko94"; /* Não pode ser alterada se já foi utilizada, poís, vai dar erro para descriptografar*/

module.exports = (app) => {
    const msgErrorDefault =
        "Não foi possível realizar a operação!. Por favor, atualize a página e tente novamente.";

    const softconnect = axios.create({
        baseURL: `${BASE_API_SOFTCONNECT}`,
        headers: {
            "Authorization": `Bearer `,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "softconnect": KEY_SOFTCONNECT
        },
    });

    const consultCEP = async (origins, destinations) => {
        const url = `/api/maps?origins=${origins}&destinations=${destinations}`

        const endereco = await softconnect.get(url)
            .then((res) => res.data)
            .catch(() => false);

        if (!endereco) {
            return { error: 'Houve um erro, por favor tente novamente.' }
        }
        return endereco
    }

    function existOrError(value, msg) {
        if (!value) throw msg;
        if (Array.isArray(value) && value.length === 0) throw msg;
        if (typeof value === "string" && !value.trim()) throw msg;
    }

    function notExistOrError(value, msg) {
        try {
            existOrError(value, msg);
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

    function encrypt(texto) {
        const encryptText = CryptoJS.AES.encrypt(
            texto,
            SECRET_ENCRYPT
        ).toString();
        return encryptText;
    }

    function decrypt(texto) {
        const bytes = CryptoJS.AES.decrypt(texto, SECRET_ENCRYPT);
        const decryptText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptText;
    }

    function utility_console(name = null, error = null, saveDB = true) {
        console.log("########################################")
        console.log(`Function: ${name}`);
        console.log(JSON.stringify(error));
        console.log("########################################")
        /* Salva no banco de dados */
        if (saveDB) {
            const moodelo = {
                name: name,
                error: JSON.stringify(error),
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
    return {
        consultCEP,
        existOrError,
        notExistOrError,
        notExistOrErrorDB,
        encrypt,
        decrypt,
        utility_console,
        msgErrorDefault,
    };
};
