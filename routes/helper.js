const errorWrapper = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error(err)
            res.status(500).send('Unexpected server error');
        });
    }
}

module.exports = {
    errorWrapper
}