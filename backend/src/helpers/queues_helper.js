// var q = null;
// if (process.env.RABBITMQ == "true") {
//     console.log("Using RMQ Queue");
//     const rmq = require("./rmq_helper");
//     q = new rmq();
// } else {
//     q = require("./bull_helper");
// }

const q = require("./bull_helper");

const addToQueue = async (
    QueueName,
    MessageBody,
    { delay = 0, priority = undefined } = {}
) => {
    return await q.addToQueue(QueueName, MessageBody, {
        delay: delay,
        priority
    });
};

const addBulkToQueue = async (QueueName, MessageBody) => {
    return await q.addBulkToQueue(QueueName, MessageBody);
};

const addToDLQ = async (sourceQueue, jobData, errorMessage) => {
    return await q.sendToDeadLetterQueue(sourceQueue, jobData, errorMessage);
};

module.exports = {
    addToQueue,
    addBulkToQueue,
    addToDLQ
};
