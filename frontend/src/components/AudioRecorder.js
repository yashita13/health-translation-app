import React, { useState, useRef } from 'react';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const AudioRecorder = ({ onRecordingComplete, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(audioBlob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setRecordingTime(seconds);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to record audio.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Tooltip title={isRecording ? `Recording: ${formatTime(recordingTime)}` : "Record Audio"}>
            <div style={{ position: 'relative' }}>
                <IconButton
                    color={isRecording ? "error" : "primary"}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={disabled}
                    size="large"
                >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                </IconButton>
                {isRecording && (
                    <CircularProgress
                        size={60}
                        thickness={4}
                        value={(recordingTime % 30) * (100 / 30)}
                        style={{
                            position: 'absolute',
                            top: -2,
                            left: -2,
                            zIndex: 1,
                        }}
                    />
                )}
                {isRecording && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.75rem',
                        color: '#f44336',
                        whiteSpace: 'nowrap'
                    }}>
                        {formatTime(recordingTime)}
                    </div>
                )}
            </div>
        </Tooltip>
    );
};

export default AudioRecorder;