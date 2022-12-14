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

            /*    console.log(elemento.slice(0, elemento.length - 3)) */
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

    return { simplify }
}