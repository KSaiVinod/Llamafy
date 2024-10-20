const axios = require("axios");
const cheerio = require("cheerio");
const Ajv = require("ajv");
const logger = require("../helpers/logger_helper")("FORM_CONTROLLER");
const ajv = new Ajv({ allErrors: true });

ajv.addFormat("base64", {
    type: "string",
    validate: (base64String) => {
        return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(
            base64String
        );
    },
});

ajv.addFormat("date", {
    type: "string",
    validate: (dateString) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    },
});

const textHeadingSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextHeading",
        },
        text: {
            type: "string",
            maxLength: 80,
            minLength: 1,
        },
    },
    required: ["type", "text"],
};

const textSubheadingSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextSubheading",
        },
        text: {
            type: "string",
            maxLength: 80,
            minLength: 1,
        },
    },
    required: ["type", "text"],
};

const textBodySchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextBody",
        },
        text: {
            type: "string",
            maxLength: 4096,
            minLength: 1,
        },
        "font-weight": {
            type: "string",
            enum: ["bold", "italic", "bold_italic", "normal"],
        },
        strikethrough: {
            type: "boolean",
        },
        markdown: {
            type: "boolean",
            default: false,
        },
    },
    required: ["type", "text"],
};

const textCaptionSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextCaption",
        },
        text: {
            type: "string",
            maxLength: 409,
            minLength: 1,
        },
        "font-weight": {
            type: "string",
            enum: ["bold", "italic", "bold_italic", "normal"],
        },
        strikethrough: {
            type: "boolean",
        },
        markdown: {
            type: "boolean",
            default: false,
        },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "text"],
};

const richTextSchema = {
    type: "object",
    additionalProperties: false,

    properties: {
        type: { type: "string", const: "RichText" },
        name: {
            type: "string",
        },
        text: {
            oneOf: [
                { type: "string", minLength: 1 },
                {
                    type: "array",
                    items: { type: "string" },
                    minItems: 1,
                },
            ],
        },
        visible: { type: "boolean", default: true },
    },
    required: ["type", "text", "name"],
};

const textInputSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextInput",
        },
        label: {
            type: "string",
            maxLength: 20,
            minLength: 1,
        },
        name: {
            type: "string",
        },
        "input-type": {
            type: "string",
            enum: ["text", "number", "email", "password", "passcode", "phone"],
        },
        required: { type: "boolean" },
        "helper-text": {
            type: "string",
            maxLength: 80,
        },
        "min-chars": {
            type: "integer",
            minimum: 1,
        },
        "max-chars": {
            type: "integer",
            maximum: 80,
            default: 80,
        },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "name"],
};

const textAreaSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "TextArea",
        },
        label: {
            type: "string",
            maxLength: 20,
            minLength: 1,
        },
        name: {
            type: "string",
        },
        required: { type: "boolean" },
        "helper-text": {
            type: "string",
            maxLength: 80,
        },
        "max-length": {
            type: "integer",
            default: 600,
        },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "name"],
};

const checkboxGroupSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "CheckboxGroup",
        },
        label: {
            type: "string",
            maxLength: 30,
            minLength: 1,
        },
        name: {
            type: "string",
        },
        "data-source": {
            type: "array",
            minItems: 1,
            maxItems: 20,
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                        maxLength: 30,
                    },
                },
            },
        },
        "min-selected-items": {
            type: "integer",
        },
        "max-selected-items": {
            type: "integer",
        },
        required: { type: "boolean" },
        enabled: { type: "boolean" },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "data-source", "name"],
};

const radioButtonsGroupSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "RadioButtonsGroup",
        },
        name: {
            type: "string",
        },
        label: {
            type: "string",
            maxLength: 30,
            minLength: 1,
        },
        "data-source": {
            type: "array",
            minItems: 1,
            maxItems: 20,
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                        maxLength: 30,
                    },
                },
            },
        },
        required: { type: "boolean" },
        enabled: { type: "boolean" },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "data-source", "name"],
};

const dropdownSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "Dropdown",
        },
        name: {
            type: "string",
        },
        label: {
            type: "string",
            maxLength: 20,
            minLength: 1,
        },
        "data-source": {
            type: "array",
            minItems: 1,
            maxItems: 200,
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                        maxLength: 30,
                    },
                },
            },
        },
        required: { type: "boolean" },
        enabled: { type: "boolean" },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "name", "data-source"],
};

const datePickerSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "DatePicker",
        },
        label: {
            type: "string",
            maxLength: 40,
            minLength: 1,
        },
        name: {
            type: "string",
        },
        "min-date": {
            type: "string",
            format: "date",
        },
        "max-date": {
            type: "string",
            format: "date",
        },
        "unavailable-dates": {
            type: "array",
            items: {
                type: "string",
                format: "date",
            },
        },
        required: { type: "boolean" },
        visible: {
            type: "boolean",
            default: true,
        },
    },
    required: ["type", "label", "name"],
};

const imageSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
            const: "Image",
        },
        name: {
            type: "string",
        },
        src: {
            type: "string",
            format: "base64",
        },
        width: {
            type: "integer",
            maximum: 2000,
        },
        height: {
            type: "integer",
            maximum: 2000,
        },
        "scale-type": {
            type: "string",
            enum: ["cover", "contain"],
            default: "contain",
        },
        "aspect-ratio": {
            type: "number",
            default: 1,
        },
        "alt-text": {
            type: "string",
            maxLength: 100,
        },
    },
    required: ["type", "src", "alt-text", "name"],
};

const footerSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        type: { type: "string", const: "Footer" },
        label: { type: "string", minLength: 1, maxLength: 35 },
        "left-caption": { type: "string", maxLength: 15 },
        "right-caption": { type: "string", maxLength: 15 },
        "center-caption": { type: "string", maxLength: 15 },
        enabled: { type: "boolean" },
        "on-click-action": {
            type: "object",
            additionalProperties: false,
            properties: {
                name: { type: "string" },
                next: { type: "object" },
                payload: { type: "object" },
            },
            required: ["name"],
        },
    },
    required: ["type", "label", "on-click-action"],
};

// Define the complete schema for the flow JSON
const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "WhatsApp Flow Schema",
    type: "object",
    properties: {
        version: {
            type: "string",
            description: "Version of the flow",
            enum: ["1.0", "2.0", "3.0", "3.1", "4.0", "5.0", "5.1"],
        },
        screens: {
            type: "array",
            description: "List of screens in the flow",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                    },
                    data: {
                        type: "object",
                    },
                    terminal: {
                        type: "boolean",
                        default: false,
                    },
                    layout: {
                        type: "object",
                        properties: {
                            type: {
                                type: "string",
                                const: "SingleColumnLayout",
                            },
                            children: {
                                type: "array",
                                items: {
                                    oneOf: [
                                        { $ref: "#/definitions/textHeading" },
                                        {
                                            $ref: "#/definitions/textSubheading",
                                        },
                                        { $ref: "#/definitions/textBody" },
                                        { $ref: "#/definitions/textCaption" },
                                        { $ref: "#/definitions/richText" },
                                        { $ref: "#/definitions/textInput" },
                                        { $ref: "#/definitions/textArea" },
                                        { $ref: "#/definitions/checkboxGroup" },
                                        {
                                            $ref: "#/definitions/radioButtonsGroup",
                                        },
                                        { $ref: "#/definitions/dropdown" },
                                        { $ref: "#/definitions/datePicker" },
                                        { $ref: "#/definitions/image" },
                                        { $ref: "#/definitions/footer" },
                                    ],
                                },
                            },
                        },
                        required: ["type", "children"],
                    },
                },
                required: ["id", "title", "layout"],
            },
        },
    },
    required: ["version", "screens"],
    additionalProperties: false,
    definitions: {
        textHeading: textHeadingSchema,
        textSubheading: textSubheadingSchema,
        textBody: textBodySchema,
        textCaption: textCaptionSchema,
        richText: richTextSchema,
        textInput: textInputSchema,
        textArea: textAreaSchema,
        checkboxGroup: checkboxGroupSchema,
        radioButtonsGroup: radioButtonsGroupSchema,
        dropdown: dropdownSchema,
        datePicker: datePickerSchema,
        image: imageSchema,
        footer: footerSchema,
    },
};

const getGoogleFormJson = async (url) => {
    logger.info("skdjhfjksdhfjksdhfjks");
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const scriptContent = $('script:contains("FB_PUBLIC_LOAD_DATA_")').html();

    const beginIndex = scriptContent.indexOf("[");
    const lastIndex = scriptContent.lastIndexOf(";");
    const jsonData = scriptContent.substring(beginIndex, lastIndex).trim();
    const questionsData = JSON.parse(jsonData);
    const formTitle = questionsData[1][0];
    const questionsDataArray = questionsData[1][1];

    const components = questionsDataArray.map((questionData) => {
        // console.log(JSON.stringify(questionData[4]?.[0]?.[2]));
        let minValidation = null;
        let maxValidation = null;
        const id = questionData[0];
        const text = questionData[1];
        let type = "unknown";
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
        console.log(minValidation, "\n\n");

        let otherInput;

        switch (questionData[3]) {
            case 2:
                type = "radio";
                questionData[4][0][1].forEach((choice) => {
                    if (choice[0] && choice[0] != "") choices.push(choice[0]);
                    else otherInput = true;
                });
                break;
            case 4:
                type = "checkbox";
                questionData[4][0][1].forEach((choice) => {
                    if (choice[0] && choice[0] != "") choices.push(choice[0]);
                    else otherInput = true;
                });
                break;
            case 3:
                type = "dropdown";
                questionData[4][0][1].forEach((choice) => {
                    if (choice[0] && choice[0] != "") choices.push(choice[0]);
                    else otherInput = true;
                });
                break;
            case 1:
                type = "text-input";
                break;
            case 0:
                type = "text-area";
                break;
            case 7:
                type = "date";
                break;
            case 8:
                type = "button";
                break;
            case 9:
                type = "datepicker";
                break;
            case 5:
                type = "checkbox";
                questionData[4].forEach((row) => {
                    row[1].forEach((choice) => {
                        if (choice[0] && choice[0] != "")
                            choices.push(choice[0]);
                        else otherInput = true;
                    });
                });
                break;
            case 6:
                type = "checkbox";
                questionData[4].forEach((row) => {
                    row[1].forEach((choice) => {
                        if (choice[0] && choice[0] != "")
                            choices.push(choice[0]);
                        else otherInput = true;
                    });
                });
                break;
            case 10:
                type = "timepicker";
                break;
            default:
                type = "unknown";
        }

        return {
            id: id,
            text: text,
            type: type,
            image,
            required,
            minValidation,
            maxValidation,
            description,
            choices: choices.length > 0 ? choices : undefined,
            otherInput,
        };
    });
    return { formTitle, components };
};

const validateFlowJson = (flowJson) => {
    // Compile the schema with AJV
    const validate = ajv.compile(schema);
    const isValid = validateFlow(flowJson);
    logger.info("Is the data valid?", isValid);

    return isValid;
};

module.exports = {
    getGoogleFormJson,
    validateFlowJson,
};
