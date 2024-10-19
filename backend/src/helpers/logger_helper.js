const winston = require("../handlers/winston_handler");

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

module.exports = function (options) {
    var module = options;

    function clear() {
        // return;
    }
    function unset() {}

    function levelCheck(level) {
        const level_score = levels[process.env.LOG_LEVEL?.toLowerCase()];

        if (level <= level_score) {
            return true;
        }

        return false;
    }

    function silly(message, ...args) {
        //level: 6
        if (!levelCheck(6)) return;
        message = formatMsg(message, ...args);
        winston.silly(message, { module });
    }
    function debug(message, ...args) {
        //level: 5
        if (!levelCheck(5)) return;
        message = formatMsg(message, ...args);
        winston.debug(message, { module });
    }
    function verbose(message, ...args) {
        //level: 4
        if (!levelCheck(4)) return;
        message = formatMsg(message, ...args);
        winston.verbose(message, { module });
    }
    function http(message, ...args) {
        //level: 3
        if (!levelCheck(3)) return;
        message = formatMsg(message, ...args);
        winston.http(message, { module });
    }
    function info(message, ...args) {
        //level: 2
        if (!levelCheck(2)) return;
        message = formatMsg(message, ...args);
        winston.info(message, { module });
    }
    function warn(message, ...args) {
        //level: 1
        if (!levelCheck(1)) return;
        message = formatMsg(message, ...args);
        winston.warn(message, { module });
    }
    function error(message, ...args) {
        //level: 0
        if (!levelCheck(0)) return;
        message = formatMsg(message, ...args);
        winston.error(message, { module });
    }
    function stackError(message, type = "warn") {
        try {
            message = JSON.stringify(
                message,
                Object.getOwnPropertyNames(message)
            );
            message = formatMsg(message);
        } catch (e) {
            //incase JSON stringify fails
        }
        if (type == "warn") winston.warn(message);
        else winston.debug(message);
    }

    function checkStackError(message) {
        if (!message) {
            return "undefined";
        }
        try {
            if (
                Object.getOwnPropertyNames(message)[0] == "stack" &&
                Object.getOwnPropertyNames(message)[1] == "message"
            ) {
                return JSON.stringify(
                    message,
                    Object.getOwnPropertyNames(message)
                );
            } else {
                return message;
            }
        } catch (e) {
            return message;
        }
    }

    function formatMsg(message, ...args) {
        try {
            for (var i = 0; i < args.length; i++) {
                if (args[i] && typeof args[i] == "object") {
                    args[i] = checkStackError(args[i]);
                }
            }

            if (args.length > 0) {
                return message + " " + args;
            } else {
                return message;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error("logger error", e);
        }
    }

    return {
        clear,
        unset,
        silly,
        debug,
        verbose,
        http,
        info,
        warn,
        error,
        stackError
    };
};
