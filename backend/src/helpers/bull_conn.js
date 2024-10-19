const logger = require("./logger_helper")("BULL");

let connection;

if (process.env.REDIS_QUEUE_CLUSTER == "true") {
    const { Cluster } = require("ioredis");
    logger.info("Connection queue in cluster mode");
    connection = new Cluster(
        [
            {
                port: process.env.REDIS_QUEUE_PORT,
                host: process.env.REDIS_QUEUE_HOST
            }
        ],
        {
            password: "",
            dnsLookup: (address, callback) => callback(null, address),
            redisOptions: {
                tls: {}
            }
        }
    );
} else {
    //connect to non cluster
    logger.info("Connection queue in non-cluster mode");
    connection = {
        port: process.env.REDIS_QUEUE_PORT,
        host: process.env.REDIS_QUEUE_HOST,
        password: process.env.REDIS_QUEUE_PASSWORD || "",
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        enableOfflineQueue: true
    };
}

module.exports = {
    connection
};
