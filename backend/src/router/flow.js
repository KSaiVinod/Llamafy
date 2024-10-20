const express = require('express')
const axios = require('axios')
const router = express.Router()

const FlowController = require('../controller/flow')

router.post('/flow/generate', async (req, res) => {
  const flow = new FlowController()

  try {
    const request_id = await flow.processRequest(req.body)

    res.status(200).send({
      request_id,
      status: 'ok'
    })
  } catch (error) {
    console.log('Error while processing generate request')
    res.status(400).send({ _error: error.message })
  }
})

router.post('/flow/update', async (req, res) => {
  const flow = new FlowController()

  try {
    const result = await flow.updateFlowTemplate(req.body)

    res.status(200).send({
      result
    })
  } catch (error) {
    console.log('Error while updating flow template')
  }
})

router.post('/flow/preview', async (req, res) => {
  const flow = new FlowController()

  try {
    const { token_id } = req.query
    const { content } = req.body
    const update = await flow.updateFlowTemplate(content, token_id)
    const result = await flow.generatePreviewUrl(token_id)

    console.log('>>>>>>>>>>>>>>>>>>>', result)

    res.status(200).send({
      result,
      status: 'ok'
    })
  } catch (error) {
    console.log('Error While generating preview')
  }
})

router.get('/flow/status', async (req, res) => {
  const flow = new FlowController()

  try {
    const { job_id } = req.query
    const status = await flow.getStatus(job_id)

    if (!status || (status && status !== 'completed')) {
      res.status(200).send({
        result: {
          done: false,
          status: status,
          content: {}
        },
        status: 'ok'
      })
    } else {
      const generatedContent = await flow.getGeneratedJSON(job_id)
      // const result = await flow.createFlowTemplate(job_id)
      res.status(200).send({
        result: {
          done: true,
          status: 'completed',
          // token_id: result?.id,
          content: generatedContent
        },
        status: 'ok'
      })
    }
  } catch (error) {
    console.log('Error While fetching status', error.message)
  }
})

module.exports = router
