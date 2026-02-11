// const GEMINI_URL =
//     "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

// async function translateText(text, targetLanguage) {
//     const response = await fetch(
//         `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
//         {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 contents: [
//                     {
//                         parts: [
//                             {
//                                 text: `
// You are a professional medical interpreter.

// Translate the following clinical message into ${targetLanguage}.
// Maintain medical accuracy and clarity.
// Do NOT explain.
// Return ONLY the translated text.

// Message:
// ${text}
// `
//                             }
//                         ]
//                     }
//                 ]
//             })
//         }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//         console.error("Gemini API error:", data);
//         throw new Error("Gemini translation failed");
//     }

//     return data.candidates[0].content.parts[0].text.trim();
// }

// async function generateMedicalSummary(messages) {
//     const conversationText = messages
//         .map(m => `${m.senderRole}: ${m.originalText}`)
//         .join("\n");

//     const response = await fetch(
//         `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
//         {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 contents: [
//                     {
//                         parts: [
//                             {
//                                 text: `You are a clinical documentation assistant.

// Summarize the following doctor–patient conversation.
// Extract:
// - Symptoms
// - Diagnoses
// - Medications
// - Follow-up instructions

// Return ONLY valid JSON in this format:
// {
//   "symptoms": [],
//   "diagnoses": [],
//   "medications": [],
//   "followUp": ""
// }

// Conversation:
// ${conversationText}`
//                             }
//                         ]
//                     }
//                 ]
//             })
//         }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//         console.error("Gemini API error:", data);
//         throw new Error("Gemini summary failed");
//     }

//     let text = data.candidates[0].content.parts[0].text;

//     text = text.replace(/```json|```/g, "").trim();

//     try {
//         return JSON.parse(text);
//     } catch {
//         return {
//             symptoms: [],
//             diagnoses: [],
//             medications: [],
//             followUp: text
//         };
//     }
// }

// module.exports = {
//     translateText,
//     generateMedicalSummary
// };


const fs = require("fs");

const fetch = global.fetch;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "models/gemini-2.5-flash-lite";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ==================== TEXT TRANSLATION ====================

async function translateText(text, targetLanguage) {
    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `
You are a professional medical interpreter.

Translate the following clinical message into ${targetLanguage}.
Maintain medical accuracy and clarity.
Return ONLY the translated text.

Message:
${text}
                            `,
                        },
                    ],
                },
            ],
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API error:", data);

        // If rate limited, fallback gracefully
        if (data?.error?.code === 429) {
            return `[Translation unavailable - quota exceeded]\n${text}`;
        }

        throw new Error("Gemini translation failed");
    }


    return data.candidates[0].content.parts[0].text.trim();
}

// ==================== AUDIO TRANSCRIPTION ====================

async function transcribeAudio(filePath) {
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString("base64");

    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: "Transcribe this medical audio recording accurately. Return only the transcript.",
                        },
                        {
                            inline_data: {
                                mime_type: "audio/webm",
                                data: base64Audio,
                            },
                        },
                    ],
                },
            ],
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API error:", data);

        // If rate limited, fallback gracefully
        if (data?.error?.code === 429) {
            return `[Translation unavailable - quota exceeded]\n${text}`;
        }

        throw new Error("Gemini translation failed");
    }


    return data.candidates[0].content.parts[0].text.trim();
}

// ==================== MEDICAL SUMMARY ====================

async function generateMedicalSummary(messages) {
    const conversationText = messages
        .map((m) => `${m.senderRole}: ${m.originalText}`)
        .join("\n");

    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `
You are a clinical documentation assistant.

Summarize the following doctor–patient conversation.

Extract:
- Symptoms
- Diagnoses
- Medications
- Follow-up instructions

Return ONLY valid JSON in this format:
{
  "symptoms": [],
  "diagnoses": [],
  "medications": [],
  "followUp": ""
}

Conversation:
${conversationText}
                            `,
                        },
                    ],
                },
            ],
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API error:", data);

        // If rate limited, fallback gracefully
        if (data?.error?.code === 429) {
            return `[Translation unavailable - quota exceeded]\n${text}`;
        }

        throw new Error("Gemini translation failed");
    }


    let text = data.candidates[0].content.parts[0].text;

    text = text.replace(/```json|```/g, "").trim();

    try {
        return JSON.parse(text);
    } catch {
        return {
            symptoms: [],
            diagnoses: [],
            medications: [],
            followUp: text,
        };
    }
}

module.exports = {
    translateText,
    transcribeAudio,
    generateMedicalSummary,
};
