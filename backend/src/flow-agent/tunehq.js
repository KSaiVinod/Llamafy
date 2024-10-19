const axios = require("axios");

// Global Configuration
const API_ENDPOINT = "https://proxy.tune.app/chat/completions";
const AUTH_TOKEN = process.env.TUNEHQ_APIKEY;
const HEADERS = {
    Authorization: AUTH_TOKEN,
    "Content-Type": "application/json",
};

// Function to call the API and extract the relevant content
async function callTuneStudioAPI(
    messages,
    model,
    input,
    temperature = 0.1,
    maxTokens = 100
) {
    messages = messages.map((str) => str.replace("{{I/P}}", input));

    const data = {
        temperature,
        messages,
        model,
        stream: false,
        frequency_penalty: 0.2,
        max_tokens: maxTokens,
    };

    try {
        console.log("Doing API Call to API ", API_ENDPOINT);
        console.log("DATA", data);
        const response = await axios.post(API_ENDPOINT, data, {
            headers: HEADERS,
        });

        // Log the full response for debugging
        console.log(
            "Full API Response:",
            JSON.stringify(response.data, null, 2)
        );

        // Extract the necessary part: the content from the assistant's message
        const content = response.data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("No content found in API response");
        }

        return content;
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
//         console.log("Testing the file");
//         const messages = [
//             { role: "system", content: "You are a FLOW JSON Expert." },
//             {
//                 role: "user",
//                 content:
//                     "Create a flow JSON for Text Input. Respond with only the JSON",
//             },
//         ];
//         const model = "vraj/base0-3-model-h2nlkjzi";

//         const result = await callTuneStudioAPI(messages, model);
//         console.log("Assistant Response:", result);
//     } catch (error) {
//         console.error("Error:", error.message);
//     }
// })();

module.exports = {
    callTuneStudioAPI,
};
