const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { getGoogleFormJson } = require('../controller/form');
const router = express.Router();

router.get('/form-json', async (req, res) => {
    const { url } = req.query;
    try {
        const { formTitle, components } = await getGoogleFormJson;
        res.status(200).send({
            title: formTitle,
            components
        });
    } catch (error) {
        console.error('Error scraping form data:', error);
        res.status(400).send({ _error: error.message });
    }
});

router.get('/form-json-1', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const scriptContent = $(
            'script:contains("FB_PUBLIC_LOAD_DATA_")'
        ).html();

        const beginIndex = scriptContent.indexOf('[');
        const lastIndex = scriptContent.lastIndexOf(';');
        const jsonData = scriptContent.substring(beginIndex, lastIndex).trim();
        const questionsData = JSON.parse(jsonData);
        const formTitle = questionsData[1][0];
        const questionsDataArray = questionsData[1][1];

        questionsDataArray.forEach((questionData) => {
            {
                // console.log(JSON.stringify(questionData[4]?.[0]?.[2]));
                let minValidation = null;
                let maxValidation = null;
                const id = questionData[0];
                const text = questionData[1];
                let type = 'unknown';
                const image = questionData[6] ? questionData[6][0] : null;
                const description = questionData[2];
                const choices = [];
                const required = questionData[4]?.[0]?.[2] === 1;
                // if (questionData[4] && questionData[4].length >= 3) {
                if (questionData[4]?.[0]?.[4]?.[0]?.[1] === 200) {
                    minValidation = questionData[4]?.[0]?.[4]?.[0]?.[2]?.[0];
                } else if (questionData[4]?.[0]?.[4]?.[0]?.[1] === 201) {
                    maxValidation = questionData[4]?.[0]?.[4]?.[0]?.[2]?.[0];
                } else {
                    minValidation = questionData[4]?.[0]?.[4]?.[0]?.[2]?.[0];
                    maxValidation = questionData[4]?.[0]?.[4]?.[0]?.[2]?.[0];
                }
                // minValidation = JSON.stringify();
                // maxValidation = JSON.stringify(questionData[4]?.[0]?.[4]?.[0]); // 200 = min, 201 = max, 204 = exact
                // }
                console.log(minValidation, '\n\n');

                let otherInput;

                switch (questionData[3]) {
                    case 2:
                        type = 'radio';
                        questionData[4][0][1].forEach((choice) => {
                            if (choice[0] && choice[0] != '')
                                choices.push(choice[0]);
                            else otherInput = true;
                        });
                        break;
                    case 4:
                        type = 'checkbox';
                        questionData[4][0][1].forEach((choice) => {
                            if (choice[0] && choice[0] != '')
                                choices.push(choice[0]);
                            else otherInput = true;
                        });
                        break;
                    case 3:
                        type = 'dropdown';
                        questionData[4][0][1].forEach((choice) => {
                            if (choice[0] && choice[0] != '')
                                choices.push(choice[0]);
                            else otherInput = true;
                        });
                        break;
                    case 1:
                        type = 'short-answer';
                        break;
                    case 0:
                        type = 'paragraph';
                        break;
                    case 7:
                        type = 'date';
                        break;
                    case 8:
                        type = 'button';
                        break;
                    case 9:
                        type = 'datepicker';
                        break;
                    case 5:
                        type = 'checkbox';
                        questionData[4].forEach((row) => {
                            row[1].forEach((choice) => {
                                if (choice[0] && choice[0] != '')
                                    choices.push(choice[0]);
                                else otherInput = true;
                            });
                        });
                        break;
                    case 6:
                        type = 'checkbox';
                        questionData[4].forEach((row) => {
                            row[1].forEach((choice) => {
                                if (choice[0] && choice[0] != '')
                                    choices.push(choice[0]);
                                else otherInput = true;
                            });
                        });
                        break;
                    case 10:
                        type = 'timepicker';
                        break;
                    default:
                        type = 'unknown';
                }

                let component_ele = {
                    id: id,
                    text: text,
                    type: type,
                    image,
                    required,
                    minValidation,
                    maxValidation,
                    description,
                    choices: choices.length > 0 ? choices : undefined,
                    otherInput
                };
                console.log(component_ele);
            }
        });

        res.status(200).send({
            title: formTitle,
            components
        });
    } catch (error) {
        console.error('Error scraping form data:', error);
        res.status(400).send({ _error: error.message });
    }
});

module.exports = router;
