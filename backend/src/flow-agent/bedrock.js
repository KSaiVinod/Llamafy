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

async function callLlama3API(userMessage, input) {
    const template = handlebars.compile(userMessage);
    userMessage = template({ input });

    const prompt = `
      ${userMessage}
    `;

    const request = {
        prompt,
        max_gen_len: 512, // Optional inference parameters
        temperature: 0.4,
        top_p: 0.9,
    };

    const maxRetries = 2; // Number of retries
    const timeoutDuration = 10000; // Timeout duration in milliseconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // console.log("Bedrock Request Object:", request);

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error("Request timed out")),
                    timeoutDuration
                )
            );

            // Send the request to the model with a timeout
            const response = await Promise.race([
                client.send(
                    new InvokeModelCommand({
                        contentType: "application/json",
                        body: JSON.stringify(request),
                        modelId: MODEL_ID,
                    })
                ),
                timeoutPromise,
            ]);

            // Decode and parse the response body
            const nativeResponse = JSON.parse(
                new TextDecoder().decode(response.body)
            );
            // console.log("🚀 Bedrock Request Object:", nativeResponse);

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
            if (attempt === maxRetries) {
                // If we've exhausted all attempts, throw the error
                if (error.response) {
                    // API responded with a non-2xx status code
                    throw new Error(
                        `API Error: ${error.response.status} - ${
                            error.response.data.message || "Unknown Error"
                        }`
                    );
                } else if (error.message === "Request timed out") {
                    throw new Error("Network Error: Request timed out");
                } else {
                    // Other errors
                    throw new Error(`Unexpected Error: ${error.message}`);
                }
            }
            console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
            // Optionally, you can add a delay before the next retry
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay before retrying
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
