const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ['doctor', 'patient'], required: true },
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    audioUrl: { type: String },
    language: { type: String, default: 'en' },
    timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    messages: [messageSchema],
    summary: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    status: { type: String, enum: ['active', 'ended'], default: 'active' }
});

module.exports = mongoose.model('Conversation', conversationSchema);