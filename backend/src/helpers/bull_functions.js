const logger = require("./logger_helper")("BULL");
const init = (allQueues) => {
    const getQueue = async (QueueName) => {
        return allQueues.default[QueueName];
    };

    const addToQueue = async (
        QueueName,
        MessageBody,
        { delay = 0, priority = undefined } = {}
    ) => {
        try {
            delay = delay ? delay * 1000 : delay;

            var QUEUE_NAME = await getQueue(QueueName);
            var job = await QUEUE_NAME.add(QueueName, MessageBody, {
                delay,
                priority
            });

            logger.info(`added job to queue ${QueueName} with job id:`, job.id);

            logger.info(job);

            return job;
        } catch (e) {
            logger.error(e.message, MessageBody);
        }
    };

    const addToQueueWithRecurring = async (
        QueueName,
        MessageBody,
        id,
        repeat
    ) => {
        try {
            const QUEUE_NAME = await getQueue(QueueName);
            var job = await QUEUE_NAME.add(QueueName, MessageBody, {
                jobId: id,
                repeat: repeat
            });

            logger.info("JOB ADDED", id, QueueName);

            return job;
        } catch (e) {
            logger.error(e.message, MessageBody);
        }
    };

    const getRepeatable = async (QueueName) => {
        const QUEUE_NAME = await getQueue(QueueName);
        logger.debug(`Getting Repetable Jobs from ${QueueName} Q`);
        const repeatableJobs = await QUEUE_NAME.getRepeatableJobs();
        logger.debug(`Repetable Jobs from ${QueueName} Q :`, repeatableJobs);
        return repeatableJobs;
    };

    const removeRepeatablebyKey = async (QueueName, repeatJobKey) => {
        const QUEUE_NAME = await getQueue(QueueName);
        logger.debug("Removing Repeatable Job with Key :", repeatJobKey);
        const isRemoved1 = await QUEUE_NAME.removeRepeatableByKey(repeatJobKey);
        logger.debug(
            `Removed Repeatable Job from ${QueueName} Q :`,
            isRemoved1
        );
        return isRemoved1;
    };

    const removeFromQueue = async (QueueName, JobId) => {
        try {
            var QUEUE_NAME = await getQueue(QueueName);
            var job = await QUEUE_NAME.getJob(JobId);
            await job?.remove();

            logger.info("JOB REMOVED", JobId, QueueName);
        } catch (e) {
            logger.error(e.message);
        }
    };

    const addBulkToQueue = async (QueueName, MessageBody) => {
        const bulk = [];

        for (var i in MessageBody) {
            let delay = MessageBody[i].delay ? MessageBody[i].delay * 1000 : 0;
            bulk.push({
                name: QueueName,
                data: MessageBody[i].data,
                opts: {
                    priority: MessageBody[i].priority || undefined,
                    delay
                }
            });
        }

        try {
            let job;

            var QUEUE_NAME = await getQueue(QueueName);
            job = await QUEUE_NAME.addBulk(bulk);

            logger.info(
                `added job to queue ${QueueName} with length:`,
                bulk.length
            );

            return job;
        } catch (e) {
            logger.error(e.message, MessageBody, QueueName);
        }
    };

    const getJobFromQueue = async (QueueName, JobId) => {
        try {
            var QUEUE_NAME = await getQueue(QueueName);
            return await QUEUE_NAME.getJob(JobId);
        } catch (e) {
            logger.stackError(e);
            logger.error(e.message);
            return false;
        }
    };

    /**
     * Retrieves jobs from a given BullMQ queue based on status.
     *
     * @param {string} QueueName - The name of the BullMQ queue.
     * @param {Array<string>} [statuses=['waiting', 'active', 'completed', 'failed', 'delayed', 'paused']] - Array of job statuses to filter.
     * @returns {Array<Job>} Array of BullMQ jobs.
     */
    const getJobsFromQueue = async (
        QueueName,
        statuses = [
            "waiting",
            "active",
            "completed",
            "failed",
            "delayed",
            "paused"
        ]
    ) => {
        try {
            var QUEUE_NAME = await getQueue(QueueName);
            return await QUEUE_NAME.getJobs(statuses);
        } catch (error) {
            logger.error(
                `Error fetching jobs from queue ${QueueName}:`,
                error.message
            );
            return [];
        }
    };

    /**
     * Sends data directly to the dead letter queue.
     *
     * @param {string} sourceQueue - The name of the original queue where the job failed.
     * @param {object} jobData - The data associated with the job.
     * @param {string} errorMessage - The error message explaining the failure.
     * @returns {Promise<Job>} The job that was added to the dead letter queue.
     */
    const sendToDeadLetterQueue = async (
        sourceQueue,
        jobData,
        errorMessage
    ) => {
        try {
            let DLQ = await getQueue(process.env.DEADLETTERQ_NAME);
            const job = await DLQ.add(`Failed Job from ${sourceQueue}`, {
                sourceQueue,
                jobData,
                error: errorMessage
            });

            logger.info(`Added job to dead letter queue. Job ID: ${job.id}`);

            return job;
        } catch (error) {
            logger.error(
                "Error sending data to the dead letter queue:",
                error.message
            );
        }
    };

    return {
        addToQueue,
        addBulkToQueue,
        removeFromQueue,
        getJobFromQueue,
        getJobsFromQueue,
        sendToDeadLetterQueue,
        addToQueueWithRecurring,
        getRepeatable,
        removeRepeatablebyKey
    };
};

module.exports = { init };
