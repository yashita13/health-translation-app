import { useRef, useState } from "react";
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { uploadAudio } from "../services/translationService";

export default function AudioRecorder({
    senderRole,
    targetLanguage,
    conversationId,
    onAudioSent,
}) {
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [recording, setRecording] = useState(false);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
        });

        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });

            if (audioBlob.size === 0) {
                console.error("Empty audio blob");
                return;
            }

            try {
                // 🔥 send conversationId to backend
                const message = await uploadAudio(
                    audioBlob,
                    senderRole,
                    targetLanguage,
                    conversationId
                );

                // 🔥 backend-generated message only
                if (message) {
                    onAudioSent(message);
                }
            } catch (err) {
                console.error("Audio upload failed:", err);
                alert("Audio message could not be sent");
            }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <IconButton
            color="primary"
            onClick={recording ? stopRecording : startRecording}
        >
            {recording ? <StopIcon /> : <MicIcon />}
        </IconButton>
    );
}
