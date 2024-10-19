const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/get-form-json', async (req, res) => {
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

        const questions = questionsDataArray.map((questionData) => {
            // console.log(JSON.stringify(questionData[4]?.[0]?.[2]));

            const id = questionData[0];
            const text = questionData[1];
            let type = 'unknown';
            const image = questionData[6] ? questionData[6][0] : null;
            const description = questionData[2];
            const choices = [];
            const required = questionData[4]?.[0]?.[2] === 1;
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

            return {
                id: id,
                text: text,
                type: type,
                image,
                required,
                description,
                choices: choices.length > 0 ? choices : undefined,
                otherInput
            };
        });
        res.status(200).send({
            title: formTitle,
            questions: questions
        });
    } catch (error) {
        console.error('Error scraping form data:', error);
        res.status(400).send({ _error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
