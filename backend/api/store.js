module.exports = (app) => {
    const { store } = app.api.softconnect;

    const get = async (req, res) => {
        const resStore = await store()

        if (resStore.error) {
            return res.status(400).send({ 500: resStore.error })
        }

        return res.json(resStore)
    };

    return { get };
};
