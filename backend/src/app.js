const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
var cors = require('cors');
const helmet = require('helmet');
var compression = require('compression');
var expressWinston = require('express-winston');
var winston = require('winston');

const formRouter = require('./router/form');
const generateRouter = require('./router/generate');
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '11mb', extended: true }));
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.Console({
                level: process.env.HTTP_LOG_LEVEL || 'debug',
                silent:
                    process.env.HTTP_LOG_CONSOLE_ENABLE == 'true' ? false : true
            })
        ],
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss.SSS'
            }),
            winston.format.printf((options) => {
                // var req_ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
                return `${options.timestamp} ${options.level} - ${options.message}`;
            })
        ),

        meta: false, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP - {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} {{JSON.stringify(req.user) || null}} {{req.headers['x-forwarded-for'] || req.socket.remoteAddress}} {{req.headers['user-agent']}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: process.env.NODE_ENV == 'local' ? true : false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function () {
            return false;
        } // optional: allows to skip some log messages based on request and/or response
    })
);
app.use(formRouter);
app.use(generateRouter);

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
