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

router.post('/flow/create', async (req, res) => {
  const flow = new FlowController()

  try {
    const result = await flow.createFlowTemplate(req.body)

    res.status(200).send({
      result
    })
  } catch (error) {
    console.log('Error while creating/updating flow template')
  }
})

router.get('/flow/preview', async (req, res) => {
  const flow = new FlowController()

  try {
    const { flow_id } = req.params
    const result = await flow.generatePreviewUrl(flow_id)

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
    const status = await flow.getStatus()

    if (status !== 'completed') {
      res.status(200).send({
        result: {
          done: false,
          content: {}
        },
        status: 'ok'
      })
    } else {
      const result = await flow.getGeneratedJSON()
      res.status(200).send({
        result: {
          done: true,
          content: result
        },
        status: 'ok'
      })
    }
  } catch (error) {
    console.log('Error While fetching status')
  }
})

module.exports = router
