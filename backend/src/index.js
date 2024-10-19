const app = require('./app');

try {
    const port = process.env.BACKEND_PORT || 4000;
    app.listen(port, () => {
        console.info('Server running on port', port);
    });
    app.keepAliveTimeout = 61000;
    app.headersTimeout = 65000;
} catch (e) {
    console.error(e);
    throw new Error('backend http service died');
}
