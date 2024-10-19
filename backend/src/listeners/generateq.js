const Queue = require('../helpers/queues_helper')
const { Worker } = require('bullmq')
const redis_handler = require('../helpers/redis_handler')
const { EXAMPLE_JSON } = require('../data/flow_json')

const connection = {
  port: process.env.REDIS_QUEUE_PORT || 6379,
  host: process.env.REDIS_QUEUE_HOST || 'localhost',
  password: process.env.REDIS_QUEUE_PASSWORD || '',
  prefix: 'llamafy',
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  reconnectonError: true,
  keepAlive: true
}

async function listen() {
  const worker = new Worker(process.env.GENERATEQ_NAME, processRequest, {
    connection,
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
    redis_handler.deletekey(`Llamafy-status`)

    redis_handler.set(`Llamafy-status`, 'Started')

    sleep(100)

    redis_handler.set(`Llamafy-status`, 'Stage 1')

    sleep(100)

    redis_handler.set(`Llamafy-status`, 'Stage 2')

    sleep(100)

    redis_handler.set(`Llamafy-status`, 'Completed')
    redis_handler.set(`Llamafy-completed`, EXAMPLE_JSON)
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
