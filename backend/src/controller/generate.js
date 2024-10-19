const logger = require("../handlers/winston_handler");
const Queue = require("../helpers/queues_helper");

class GenerateController {
    async processRequest(data) {
        try {
            const queueName = "GENERATEQ";

            Queue.addToQueue(queueName, data, { delay: 0, priority: undefined })
                .then(function (resp) {
                    logger.info(
                        `Added in queue ${queueName} with id ${resp?.id}`
                    );

                    return resp?.id;
                })
                .catch(logger.error(e, data));
        } catch (error) {
            logger.error(e, data);
        }
    }
}

module.exports = GenerateController;
