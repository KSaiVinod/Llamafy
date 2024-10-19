const logger = require("../handlers/winston_handler");
const Queue = require("../helpers/queues_helper");

class GenerateController {
    async processRequest(data) {
        try {
            const queueName = process.env.GENERATEQ_NAME;

            return await Queue.addToQueue(queueName, data, {
                delay: 0,
                priority: undefined
            })
                .then(function (resp) {
                    logger.info(
                        `Added in queue ${queueName} with id ${resp?.id}`
                    );

                    return resp?.id;
                })
                .catch(function (e) {
                    logger.error(e, data);
                });
        } catch (error) {
            logger.error(error, data);
        }
    }
}

module.exports = GenerateController;
