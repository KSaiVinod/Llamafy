const express = require("express");
const axios = require("axios");
const router = express.Router();

const GenerateController = require("../controller/generate");

router.post("/generate", async (req, res) => {
    const generate = new GenerateController();

    try {
        const request_id = await generate.processRequest(req.body);

        console.log(">>>>>>>>>>>>>>>2", request_id);

        res.status(200).send({
            request_id,
            status: "ok"
        });
    } catch (error) {
        console.log("Error while processing generate request");
        res.status(400).send({ _error: error.message });
    }
});

module.exports = router;
