const { Worker } = require('bullmq')
const EXAMPLE_JSON = require('../data/flow_json')
const redis_handler = require('../helpers/redis_handler')
const logger = require('../helpers/logger_helper')('UPLOAD_WORKER')

const connection = {
  port: process.env.REDIS_QUEUE_PORT || 6379,
  host: process.env.REDIS_QUEUE_HOST || 'localhost',
  password: process.env.REDIS_QUEUE_PASSWORD || '',
  prefix: process.env.GENERATEQ_PREFIX,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  reconnectonError: true,
  keepAlive: true
}

async function listen() {
  logger.info(`UPLOAD WORKER STARTED 🚀`)
  logger.info(`Listening to ${process.env.GENERATEQ_NAME}`)
  const worker = new Worker(process.env.GENERATEQ_NAME, processRequest, {
    connection,
    prefix: process.env.GENERATEQ_PREFIX,
    removeOnComplete: {
      count: 20
    },
    removeOnFail: {
      age: 24 * 3600, // keep up to 24 hours
      count: 20
    },
    settings: {
      lockDuration: 900000,
      stalledInterval: 900000
    }
  })

  worker.on('failed', function (job, error) {
    logger.warn(job)
    logger.error(error.message, job.data)
  })

  worker.on('error', function (error) {
    logger.error(error)
  })

  worker.on('progress', onProgress)
  worker.on('completed', onComplete)
}

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function processRequest(job) {
  try {
    await redis_handler.set(`Llamafy-${job?.id}`, 'started')

    await sleep(5000)

    await redis_handler.set(`Llamafy-${job?.id}`, 'stage 1')

    await sleep(5000)

    await redis_handler.set(`Llamafy-${job?.id}`, 'stage 2')

    await sleep(5000)

    await redis_handler.set(`Llamafy-${job?.id}`, 'completed')
    await redis_handler.set(`Llamafy-${job?.id}-completed`, JSON.stringify(EXAMPLE_JSON))
  } catch (error) {
    console.log('Error while processing requests', error?.message)
  }
}

const onProgress = async (job, progress) => {
  logger.info(`Job progress of job ID: ${job.id} - ${progress}%`)
}
const onComplete = async (job, result) => {
  // figure out how to get success messages
  if (job.error) return
  logger.debug('Complete:', job)
  job.remove()
}
listen()
