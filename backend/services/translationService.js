const OpenAI = require('openai');
const axios = require('axios');

class TranslationService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async translateText(text, targetLanguage) {
        try {
            // Using OpenAI for high-quality medical translation
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a medical translation expert. Translate the following text to ${targetLanguage} while maintaining medical accuracy. For medical terms, use appropriate clinical terminology.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Translation error:', error);
            // Fallback to basic translation
            return this.basicTranslation(text, targetLanguage);
        }
    }

    async transcribeAudio(audioBuffer) {
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: audioBuffer,
                model: "whisper-1",
                language: "en"
            });
            return response.text;
        } catch (error) {
            console.error('Transcription error:', error);
            throw error;
        }
    }

    async generateMedicalSummary(conversation) {
        const prompt = `Analyze this doctor-patient conversation and create a structured medical summary:

    Conversation:
    ${conversation.map(msg => `${msg.senderRole}: ${msg.originalText}`).join('\n')}

    Extract and organize the following information:
    1. Chief Complaint
    2. Symptoms reported
    3. Diagnosis/Assessment
    4. Medications prescribed
    5. Follow-up actions
    6. Important notes

    Format as a clear, concise medical summary:`;

        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a medical documentation specialist. Create accurate, professional medical summaries."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 1000
        });

        return response.choices[0].message.content;
    }

    async searchConversations(query, userId) {
        // Implement semantic search using embeddings
        const embedding = await this.getEmbedding(query);

        // Search logic using vector similarity
        return this.semanticSearch(embedding, userId);
    }

    async getEmbedding(text) {
        const response = await this.openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: text
        });
        return response.data[0].embedding;
    }
}

module.exports = new TranslationService();