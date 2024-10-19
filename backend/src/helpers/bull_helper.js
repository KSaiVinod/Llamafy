const { Queue } = require("bullmq");
const logger = require("./logger_helper")("BULL");
const { connection } = require("./bull_conn");

const fn = require("./bull_functions");

const queueNames = {
    default: ["GENERATEQ"]
};

// Create all queues at the start with respective connections
const allQueues = {
    default: {}
};

// Initialize all queues in default and campaign groups
queueNames.default.forEach((queueName) => {
    const envQueueName = process.env[`${queueName}_NAME`];
    const envQueuePrefix = process.env[`${queueName}_PREFIX`];

    if (envQueueName) {
        allQueues.default[envQueueName] = new Queue(envQueueName, {
            connection,
            prefix: envQueuePrefix
        });
    } else {
        logger.warn(
            `Environment variable for queue name ${queueName} is not set`
        );
    }
});

module.exports = { ...fn.init(allQueues) };
