module.exports = (app) => {
    const { existeOuErro, utility_console, msgErrorDefault } = app.api.utilities;

    const getProducts = async (req, res) => {
        const mycart = req.query._mycart
        const dataReturn = [];

        try {
            existeOuErro(mycart, "A lista de produtos não pode ser vazia.")
            const mycartArray = JSON.parse(mycart)

            for (let index = 0; index < mycartArray.length; index++) {
                const item = mycartArray[index];
                const data = await app.db.raw(`
                SELECT 
                id, 
                name, 
                url_img, 
                price, 
                price_promotion, 
                promotion,  
                ${item.quantity} AS quantity, price*${item.quantity} AS amount, 
                price_promotion*${item.quantity} AS amount_promotion
                FROM products
                WHERE id=${item.id} 
                AND deleted_at Is Null;
                `).then((res) => res[0][0])
                dataReturn.push(data)
            }
            res.json(dataReturn);

        } catch (error) {
            utility_console({
                name: "cart.getProducts",
                type: "ERROR",
                message: "Não foi possível consultar",
                error: error
            });
            res.status(500).send(msgErrorDefault)
        }
    };

    return { getProducts };
};
