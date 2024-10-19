const fs = require('fs')
const FormData = require('form-data')
const logger = require('../handlers/winston_handler')
const Queue = require('../helpers/queues_helper')
const { default: axios } = require('axios')
const redis_handler = require('../helpers/redis_handler')

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

  async createFlowTemplate(data) {
    try {
      fs.writeFileSync('test.json', data.content, err => {
        throw Error('Unable to create json file')
      })
      const form = new FormData()
      form.append('file', fs.createReadStream('test.json'), { contentType: 'application/json' })
      form.append('name', 'test.json')
      form.append('asset_type', 'FLOW_JSON')

      axios
        .post(`${process.env.META_BASE_URL}/${data.flow_id}/assets`, form, {
          headers: {
            Authorization: `Bearer ${process.env.META_BEARER_TOKEN}`,
            ...form.getHeaders()
          }
        })
        .then(res => {
          return res
        })
        .catch(error => {
          logger.error(error, data)
        })
    } catch (error) {
      console.log('Error While Creating Meta Flow', error?.message)
      logger.error(error, data)
    }
  }

  async generatePreviewUrl(flow_id) {
    try {
      axios
        .get(`${process.env.META_BASE_URL}/${flow_id}?fields=preview.invalidate(false)`, {
          headers: {
            Authorization: `Bearer ${process.env.META_BEARER_TOKEN}`
          }
        })
        .then(res => {
          return res.data
        })
        .catch(err => {
          logger.error(err, flow_id)
        })
    } catch (error) {
      logger.error(error, flow_id)
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
