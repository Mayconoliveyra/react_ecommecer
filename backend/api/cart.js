module.exports = (app) => {
    const { existeOuErro, utility_console, msgErrorDefault } = app.api.utilities;

    const getProducts = async (req, res) => {

        const ipCliente = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        console.log(ipCliente)
        const ipCliente2 = req.ip
        console.log(ipCliente2)
        const mycart = req.query._mycart
        const dataReturn = [];

        try {
            existeOuErro(mycart, "A lista de produtos não pode ser vazia.")
            const mycartArray = JSON.parse(mycart)

            for (let index = 0; index < mycartArray.length; index++) {
                const id = mycartArray[index][0];
                const quantity = mycartArray[index][1];

                const data = await app.db.raw(`
                SELECT 
                id, 
                name, 
                url_img, 
                price, 
                price_promotion, 
                promotion,  
                ${quantity} AS quantity, price*${quantity} AS amount, 
                price_promotion*${quantity} AS amount_promotion
                FROM products
                WHERE id=${id} 
                AND deleted_at Is Null;
                `).then((res) => res[0][0])
                dataReturn.push(data)
            }
            res.json(dataReturn);

        } catch (error) {
            utility_console({
                name: "cart.getProducts",
                error: error
            });
            res.status(500).send(msgErrorDefault)
        }
    };
    const incrementProduct = async (req, res) => {
        const body = req.body
        const modelo = {
            ip_user: req.ip,
            id_product: body.id_product,
            quantity: body.quantity,
        }


        try {
            existeOuErro(modelo.ip_user, "ip_user não pode ser nulo.")
            existeOuErro(modelo.id_product, "id_product não pode ser nulo.")
            existeOuErro(modelo.quantity, "quantity não pode ser nulo.")

            app.db("temp_cart")
                .insert(modelo)
                .then(() => res.status(204).send())
                .catch((error) => {
                    utility_console({
                        name: "cart.incrementProduct",
                        error: error,
                    });
                    return res.status(500).send(msgErrorDefault);
                });
        } catch (error) {
            utility_console({
                name: "cart.incrementProduct",
                error: error,
            });
            res.status(500).send(msgErrorDefault)
        }
    };

    return { getProducts, incrementProduct };
};
