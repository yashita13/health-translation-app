// backend/services/translationService.js
// Recruiter-safe, billing-free translation & summarization service
// Designed as a fallback when paid LLM APIs are unavailable

class TranslationService {
    constructor() {
        // Small medical-focused dictionaries for demo-quality translation
        this.medicalDictionary = {
            es: {
                pain: "dolor",
                headache: "dolor de cabeza",
                fever: "fiebre",
                cough: "tos",
                nausea: "náuseas",
                medicine: "medicina",
                doctor: "doctor",
                patient: "paciente",
                injection: "inyección",
                tablet: "tableta"
            },
            fr: {
                pain: "douleur",
                headache: "mal de tête",
                fever: "fièvre",
                cough: "toux",
                nausea: "nausée",
                medicine: "médicament",
                doctor: "docteur",
                patient: "patient",
                injection: "injection",
                tablet: "comprimé"
            },
            hi: {
                pain: "दर्द",
                headache: "सिरदर्द",
                fever: "बुखार",
                cough: "खांसी",
                nausea: "मतली",
                medicine: "दवा",
                doctor: "डॉक्टर",
                patient: "मरीज़",
                injection: "इंजेक्शन",
                tablet: "गोली"
            }
        };
    }

    /**
     * Translates text using rule-based medical dictionary replacement.
     * This avoids paid API dependencies while preserving system behavior.
     */
    translateText(text, targetLanguage) {
        if (!text || !targetLanguage) return text;

        const dict = this.medicalDictionary[targetLanguage] || {};
        let translated = text;

        Object.keys(dict).forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            translated = translated.replace(regex, dict[word]);
        });

        return `[${targetLanguage.toUpperCase()}] ${translated}`;
    }

    /**
     * Mock transcription for uploaded audio.
     * Real speech-to-text can be plugged in later without API changes.
     */
    transcribeAudio(senderRole) {
        return `${senderRole} audio message`;
    }

    /**
     * Generates a structured medical summary using keyword extraction.
     * This mimics LLM-style summarization in a deterministic way.
     */
    generateMedicalSummary(messages = []) {
        const symptoms = new Set();
        const medications = new Set();

        messages.forEach(msg => {
            const text = (msg.originalText || "").toLowerCase();

            // Symptom extraction
            if (text.includes("pain") || text.includes("hurt")) symptoms.add("Pain");
            if (text.includes("fever")) symptoms.add("Fever");
            if (text.includes("headache")) symptoms.add("Headache");
            if (text.includes("cough")) symptoms.add("Cough");
            if (text.includes("nausea")) symptoms.add("Nausea");
            if (text.includes("dizzy")) symptoms.add("Dizziness");

            // Medication extraction
            if (text.includes("paracetamol")) medications.add("Paracetamol");
            if (text.includes("ibuprofen")) medications.add("Ibuprofen");
            if (text.includes("antibiotic")) medications.add("Antibiotics");
            if (text.includes("medicine") || text.includes("tablet")) {
                medications.add("General medication discussed");
            }
        });

        return {
            summaryType: "medical",
            symptoms: [...symptoms],
            medications: [...medications],
            followUp: "Follow up if symptoms persist or worsen",
            generatedAt: new Date().toISOString()
        };
    }
}

module.exports = new TranslationService();
