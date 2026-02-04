import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

export const translateText = async (text, targetLanguage) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/translate/text`,
        {
            text,
            targetLanguage,
        }
    );
    return response.data;
};

export const uploadAudio = async (audioBlob, senderRole, targetLanguage) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("senderRole", senderRole);
    formData.append("targetLanguage", targetLanguage);

    const response = await axios.post(
        `${API_BASE_URL}/api/translate/audio`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const createConversation = async () => {
    const response = await axios.post(
        `${API_BASE_URL}/api/conversations`
    );
    return response.data.conversation;
};

export const sendMessage = async (
    conversationId,
    senderId,
    senderRole,
    originalText,
    targetLanguage
) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/conversations/${conversationId}/messages`,
        {
            senderId,
            senderRole,
            originalText,
            targetLanguage,
        }
    );
    return response.data.message;
};

export const fetchConversations = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/conversations`
    );
    return response.data.conversations;
};

export const searchConversations = async (query) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/search?q=${query}`
    );
    return response.data.results;
};

export const generateSummary = async (conversationId) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/summarize`,
        {
            conversationId,
        }
    );
    return response.data.summary;
};
