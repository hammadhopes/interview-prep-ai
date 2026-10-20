function notFoundHandler(req, res) {
    res.status(404).json({
        message: "Route not found."
    });
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const isClientError = err.expose === true && err.status >= 400 && err.status < 500;

    if (!isClientError) {
        console.error(err);
    }

    res.status(isClientError ? err.status : 500).json({
        message: isClientError ? err.message : "Something went wrong on our side. Please try again."
    });
}

module.exports = { notFoundHandler, errorHandler };