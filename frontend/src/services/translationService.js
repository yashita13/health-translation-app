import axios from "axios";

/**
 * Base URL for backend API
 * - Local: http://localhost:5000
 * - Production: set in hosting platform (Vercel / Netlify)
 */
const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Axios instance for consistent config
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

/**
 * Translate plain text
 */
export const translateText = async (text, targetLanguage) => {
    try {
        const response = await api.post("/api/translate/text", {
            text,
            targetLanguage,
        });
        return response.data;
    } catch (error) {
        console.error("Text translation failed", error);
        throw new Error("Translation service unavailable");
    }
};

/**
 * Upload audio and receive transcription + translation
 */
export const uploadAudio = async (
    audioBlob,
    senderRole,
    targetLanguage
) => {
    try {
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("senderRole", senderRole);
        formData.append("targetLanguage", targetLanguage);

        const response = await api.post(
            "/api/translate/audio",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Audio upload failed", error);
        throw new Error("Audio translation failed");
    }
};

/**
 * Create a new conversation
 */
export const createConversation = async () => {
    try {
        const response = await api.post("/api/conversations");
        return response.data.conversation;
    } catch (error) {
        console.error("Create conversation failed", error);
        throw new Error("Unable to start conversation");
    }
};

/**
 * Send a message inside a conversation
 */
export const sendMessage = async (
    conversationId,
    senderId,
    senderRole,
    originalText,
    targetLanguage
) => {
    try {
        const response = await api.post(
            `/api/conversations/${conversationId}/messages`,
            {
                senderId,
                senderRole,
                originalText,
                targetLanguage,
            }
        );

        return response.data.message;
    } catch (error) {
        console.error("Send message failed", error);
        throw new Error("Message could not be sent");
    }
};

/**
 * Fetch all conversations
 */
export const fetchConversations = async () => {
    try {
        const response = await api.get("/api/conversations");
        return response.data.conversations;
    } catch (error) {
        console.error("Fetch conversations failed", error);
        throw new Error("Unable to load conversations");
    }
};

/**
 * Search conversations by keyword
 */
export const searchConversations = async (query) => {
    try {
        const response = await api.get(
            `/api/search?q=${encodeURIComponent(query)}`
        );
        return response.data.results;
    } catch (error) {
        console.error("Search failed", error);
        throw new Error("Search failed");
    }
};

/**
 * Generate medical summary for a conversation
 */
export const generateSummary = async (conversationId) => {
    try {
        const response = await api.post("/api/summarize", {
            conversationId,
        });
        return response.data.summary;
    } catch (error) {
        console.error("Summary generation failed", error);
        throw new Error("Summary could not be generated");
    }
};
