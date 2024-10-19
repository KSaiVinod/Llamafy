const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
var cors = require('cors');
const helmet = require('helmet');
var compression = require('compression');

const formRouter = require('./router/form');
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '11mb', extended: true }));

app.use(formRouter);

process.on('uncaughtException', function (err) {
    // eslint-disable-next-line no-console
    console.error(
        new Date().toUTCString() + ' uncaughtException:',
        err.message
    );
    // eslint-disable-next-line no-console
    console.error(err.stack);
    process.exit(1);
});

module.exports = app;
