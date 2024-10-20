const fs = require('fs')
const FormData = require('form-data')
const logger = require('../helpers/logger_helper')('FLOW_CONTROLLER')
const Queue = require('../helpers/queues_helper')
const { default: axios } = require('axios')
const redis_handler = require('../helpers/redis_handler')
const stream = require('stream')

class FlowController {
  async processRequest(data) {
    try {
      const queueName = process.env.GENERATEQ_NAME

      return await Queue.addToQueue(queueName, data, {
        delay: 0,
        priority: undefined
      })
        .then(function (resp) {
          logger.info(`Added in queue ${queueName} with id ${resp?.id}`)

          return resp?.id
        })
        .catch(function (e) {
          logger.error(e, data)
        })
    } catch (error) {
      logger.error(error, data)
    }
  }

  async updateFlowTemplate(data, token_id) {
    try {
      const JSONString = JSON.stringify(data)

      const bufferStream = new stream.PassThrough()
      bufferStream.end(Buffer.from(JSONString))

      const form = new FormData()
      form.append('name', 'flow.json')
      form.append('asset_type', 'FLOW_JSON')
      form.append('file', bufferStream, {
        filename: 'flow.json',
        contentType: 'application/json'
      })

      axios
        .post(`${process.env.META_BASE_URL}/${token_id}/assets`, form, {
          headers: {
            Authorization: `Bearer ${process.env.META_BEARER_TOKEN}`,
            ...form.getHeaders()
          }
        })
        .then(res => {
          return res
        })
        .catch(error => {
          logger.error(error.response)
        })
    } catch (error) {
      console.log('Error While Creating Meta Flow', error?.message)
      logger.error(error)
    }
  }

  async createFlowTemplate(request_id) {
    try {
      axios
        .post(
          `${process.env.META_BASE_URL}/${process.env.META_WABA_ID}/flows`,
          {
            name: `test_flow_${request_id}`,
            categories: ['OTHER']
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.META_BEARER_TOKEN}`
            }
          }
        )
        .then(res => res)
        .catch(err => {
          logger.error(err?.message, request_id)
        })
    } catch (error) {
      console.log('Error While Creating Meta Flow', error?.message)
      logger.error(error, request_id)
    }
  }

  async generatePreviewUrl(flow_id) {
    try {
      return axios
        .get(`${process.env.META_BASE_URL}/${flow_id}?fields=preview.invalidate(false)`, {
          headers: {
            Authorization: `Bearer ${process.env.META_BEARER_TOKEN}`
          }
        })
        .then(res => {
          return res.data
        })
        .catch(err => {
          logger.error(err.response, flow_id)
        })
    } catch (error) {
      logger.error(error.message, flow_id)
    }
  }

  async getStatus(id) {
    try {
      const status = await redis_handler.get(`Llamafy-${id}`)

      return status
    } catch (error) {
      logger.error(error)
    }
  }

  async getGeneratedJSON(id) {
    try {
      const output = await redis_handler.get(`Llamafy-${id}-completed`)

      return JSON.parse(output)
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = FlowController
