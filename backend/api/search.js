module.exports = (app) => {
    function simplify(text) {
        const removeFilter = [
            "",
            "a",
            "e",
            "i",
            "o",
            "u",
            "ao",
            "um",
            "de",
            "da",
            "das",
            "dos",
            "que",
            "para",
            "um",
            "nas",
            "ter",
            "com",
            "tem",
            "em",
            "AND"];

        const search = text
            .normalize("NFD")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .trim()
            .toLowerCase()
            .split(' ');

        const searchArray = search
        let textAndReturn = ""

        searchArray.map(elemento => {
            /* Se tiver algum caracteres do removeFilter remover */
            if (removeFilter.includes(elemento)) return

            if (elemento.slice(-1) == 's') {
                /* Remove o 's' do final da palavra. ex: lampadas, tintas...*/
                textAndReturn = `${textAndReturn} name LIKE '%${elemento.slice(0, elemento.length - 1)}%' AND`;
            } else {
                textAndReturn = `${textAndReturn} name LIKE '%${elemento}%' AND`;
            }
        });
        /* Remover o AND do final da query */
        return textAndReturn.slice(0, textAndReturn.length - 3)
    }

    function simplifyText(id, text) {
        if (!id) return
        if (!text) return
        const arrayRetun = [];

        const removeFilter = [
            "",
            "a",
            "e",
            "i",
            "o",
            "u",
            "ao",
            "um",
            "de",
            "da",
            "das",
            "dos",
            "que",
            "para",
            "um",
            "nas",
            "ter",
            "com",
            "tem",
            "em"];

        /* remover caracteres especiais, retirar espaços em brancos e transforma em array. */
        const format1 = text
            .normalize("NFD")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .trim()
            .toLowerCase()
            .split(' ')
        /* remove palavras repetidas */
        const format2 = [...new Set(format1)];

        format2.map(item => {
            /* Se tiver algum caracteres do removeFilter remover */
            if (removeFilter.includes(item)) return
            arrayRetun.push({ id_product: id, text_filter: item })
        })

        return arrayRetun
    }

    return { simplify }
}