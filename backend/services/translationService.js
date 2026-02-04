class TranslationService {
    constructor() {
        this.medicalDictionary = {
            es: {
                doctor: "doctor",
                patient: "paciente",
                fever: "fiebre",
                pain: "dolor",
                cough: "tos",
                headache: "dolor de cabeza",
                flu: "gripe",
                paracetamol: "paracetamol",
                medicine: "medicina",
                tablet: "tableta",
            },
            fr: {
                doctor: "docteur",
                patient: "patient",
                fever: "fièvre",
                pain: "douleur",
                cough: "toux",
                headache: "mal de tête",
                flu: "grippe",
                paracetamol: "paracétamol",
                medicine: "médicament",
                tablet: "comprimé",
            },
            hi: {
                doctor: "डॉक्टर",
                patient: "मरीज़",
                fever: "बुखार",
                pain: "दर्द",
                cough: "खांसी",
                headache: "सिरदर्द",
                flu: "फ्लू",
                paracetamol: "पैरासिटामोल",
                medicine: "दवा",
                tablet: "गोली",
            },
        };
    }

    /**
     * SAFE translation (no async, no API, no crashes)
     * Always returns a translated string
     */
    translateText(text, targetLanguage) {
        if (!text || !targetLanguage) return text;

        const dict = this.medicalDictionary[targetLanguage] || {};
        let translated = text.toLowerCase();

        Object.keys(dict).forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            translated = translated.replace(regex, dict[word]);
        });

        return `[${targetLanguage.toUpperCase()}] ${translated}`;
    }

    /**
     * Mock audio transcription
     */
    transcribeAudio(senderRole) {
        return `${senderRole} audio message`;
    }

    /**
     * Rule-based medical summary (stable & deterministic)
     */
    generateMedicalSummary(messages = []) {
        const symptoms = new Set();
        const medications = new Set();

        messages.forEach((msg) => {
            const text = (msg.originalText || "").toLowerCase();

            if (text.includes("fever")) symptoms.add("Fever");
            if (text.includes("pain")) symptoms.add("Pain");
            if (text.includes("cough")) symptoms.add("Cough");
            if (text.includes("headache")) symptoms.add("Headache");
            if (text.includes("flu")) symptoms.add("Flu");

            if (text.includes("paracetamol"))
                medications.add("Paracetamol");
            if (text.includes("medicine") || text.includes("tablet"))
                medications.add("General medication discussed");
        });

        return {
            summaryType: "medical",
            symptoms: [...symptoms],
            medications: [...medications],
            followUp: "Follow up if symptoms persist or worsen",
            generatedAt: new Date().toISOString(),
        };
    }
}

module.exports = new TranslationService();
