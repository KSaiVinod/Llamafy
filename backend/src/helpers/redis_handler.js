const Redis = require("ioredis");
const logger = require("../helpers/logger_helper")("REDIS");

let redis;

if (process.env.REDIS_CLUSTER == "true") {
    logger.info("Connecting to Cluster", process.env.REDIS_CLUSTER);
    redis = new Redis.Cluster(
        [
            {
                host: process.env.MDB_REDIS_HOST,
                port: process.env.MDB_REDIS_PORT
            }
        ],
        {
            enableAutoPipelining: true,
            password: process.env.MDB_REDIS_PASSWORD || "",
            connectTimeout: 10000,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            dnsLookup: (address, callback) => callback(null, address),
            redisOptions: {
                tls: {}
            }
        }
    );
} else {
    redis = new Redis({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD || "",
        connectTimeout: 10000,
        enableAutoPipelining: true,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    });
}

const fn = require("./redis_handler_function");

let error = false;

redis.on("error", function (err) {
    if (!error) {
        logger.error(
            "Unable to connect to redis at " +
                process.env.REDIS_HOST +
                ":" +
                process.env.REDIS_PORT +
                " error msg:" +
                err.message
        );
        error = true;
    }
});

redis.on("connect", function (err) {
    if (error) {
        logger.info("Redis connection has recovered", err);
        error = false;
    }
    logger.info("Redis is connected");
});

const multi = async (commands) => {
    logger.debug("MULTI: with cluster");
    if (process.env.REDIS_CLUSTER == "true") {
        const output = [];
        for (let i in commands) {
            const cmd = commands[i][0];
            const args = commands[i].slice(1);
            output.push([null, await redis.call(cmd, ...args)]);
        }

        return output;
    } else {
        logger.debug("Redis: MULTI", commands);
        return redis.multi(commands, { pipeline: true }).exec();
    }
};

module.exports = { ...fn.init(redis), multi };
