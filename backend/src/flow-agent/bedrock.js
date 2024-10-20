const {
    BedrockRuntimeClient,
    InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const handlebars = require("handlebars");

const MODEL_ID = "meta.llama3-70b-instruct-v1:0"; // Model ID

// Create a Bedrock Runtime client
const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to send a prompt to Meta Llama 3 and extract the response
async function callLlama3API(userMessage, input) {
    // userMessage = userMessage.replace("{{I/P}}", JSON.stringify(input));

    const template = handlebars.compile(userMessage);
    userMessage = template({ input });

    // Format the prompt with user input
    const prompt = `
      ${userMessage}
    `;

    // Prepare the request payload
    const request = {
        prompt,
        max_gen_len: 512, // Optional inference parameters
        temperature: 0.2,
        top_p: 0.9,
    };

    try {
        console.log("Bedrock Request Object :", request);
        // Send the request to the model
        const response = await client.send(
            new InvokeModelCommand({
                contentType: "application/json",
                body: JSON.stringify(request),
                modelId: MODEL_ID,
            })
        );
        // Decode and parse the response body
        const nativeResponse = JSON.parse(
            new TextDecoder().decode(response.body)
        );
        console.log("🚀 Bedrock Request Object :", nativeResponse);
        // Extract the generated text
        const responseText = nativeResponse?.generation;
        if (!responseText) {
            throw new Error(
                `No generation found in API response ${JSON.stringify(
                    nativeResponse
                )}`
            );
        }

        return responseText.trim();
    } catch (error) {
        if (error.response) {
            // API responded with a non-2xx status code
            throw new Error(
                `API Error: ${error.response.status} - ${
                    error.response.data.message || "Unknown Error"
                }`
            );
        } else if (error.request) {
            // No response received
            throw new Error("Network Error: No response from API");
        } else {
            // Other errors
            throw new Error(`Unexpected Error: ${error.message}`);
        }
    }
}

// // Usage Example
// (async () => {
//     try {
//         const userMessage =
//             "Describe the purpose of a 'hello world' program in one sentence.";
//         const result = await callLlama3API(userMessage);
//         console.log("Assistant Response:", result);
//     } catch (error) {
//         console.error("Error:", error.message);
//     }
// })();

module.exports = {
    callLlama3API,
};
