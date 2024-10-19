const { createLogger, format, transports } = require("winston");

var silent = false;
//{error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5}
if (process.env.LOG_CONSOLE_ENABLE !== "true") {
    silent = true;
}

if (process.env.TEST_MODE == "true") silent = true;

const logger = createLogger({
    // levels: {
    //     error: 0,
    //     warn: 1,
    //     info: 2,
    //     http: 3,
    //     debug: 4,
    //     verbose: 5,
    //     silly: 6,
    //     // error: 0,
    //     // warn: 1,
    //     // info: 2,
    //     // http: 3,
    //     // verbose: 4,
    //     // debug: 5,
    //     // silly: 6,
    // },
    transports: [
        new transports.Console({
            level: process.env.LOG_LEVEL || "debug",
            silent,
            json: true,
            format:
                process.env.NODE_ENV == "local"
                    ? format.combine(
                          format.errors({ stack: true }),
                          format.label({
                              label: process.env.NODE_ENV
                          }),
                          format.colorize(),
                          format.timestamp({
                              format: "MMM-DD-YYYY HH:mm:ss.SSS"
                          }),
                          format.ms(),
                          format.prettyPrint(),
                          format.printf((options) => {
                              return `${options.timestamp} - ${
                                  options.level
                              } (${options.module}) ${JSON.stringify(
                                  options.message,
                                  null,
                                  4
                              )}`;
                          })
                          //   format.printf((options) => {
                          //       // console.log(options)
                          //       // if(options.meta_value)
                          //       // return `tt ${options.timestamp} ${options.user} (${options.label})(${options.ms}) - ${options.level}: module: ${options.moduleName} meta_data: ${JSON.stringify(options.meta_value)} message: ${JSON.stringify(options.message, null, 4)}`;
                          //       // else
                          //       // return `tt ${options.timestamp} ${options.user} (${options.label})(${options.ms}) - ${options.level}: module: ${options.moduleName} meta_data: {} message: ${JSON.stringify(options.message, null, 4)}`;
                          //       // return `tt ${options.timestamp} (${options.label})(${options.ms}) - ${options.level}: ${JSON.stringify(options.message, null, 4)}`;
                          //       return `${options.timestamp} (${options.label})(${options.ms}) - ${options.level}: ${options.message}`;
                          //   })
                      )
                    : format.combine(
                          format.timestamp({
                              format: "MMM-DD-YYYY HH:mm:ss.SSS"
                          }),
                          format.ms(),
                          format.json()
                          //   format.printf((options) => {
                          //       return `${JSON.stringify(
                          //           options.message,
                          //           null,
                          //           4
                          //       )}`;
                          //   })
                          //   format.prettyPrint()
                          //   format.printf((options) => {
                          //       return `${options.timestamp} (${options.label})(${options.ms}) - ${options.level}: ${options.message}`;
                          //   })
                      )
        })
    ]
});

module.exports = logger;
