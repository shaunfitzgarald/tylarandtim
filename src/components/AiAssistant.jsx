import { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, CircularProgress, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import { httpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import { motion, AnimatePresence } from 'framer-motion';

import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const AiAssistant = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Tylar & Tim's Wedding Assistant. Ask me anything about the big day, or say 'RSVP' to get on the list!", sender: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Optional: Auto-send
                // handleSend(null, transcript); 
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (open) scrollToBottom();
    }, [messages, open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            // Call the onRequest weddingAssistant endpoint directly
            const response = await fetch('https://us-central1-tylarandtim.cloudfunctions.net/weddingAssistantV2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { question: input } })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            const aiResponse = result.data?.answer || result.answer || "I seem to be having trouble articulating myself right now.";
            setMessages(prev => [...prev, { text: aiResponse, sender: 'system' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'system' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            bottom: 100,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <Paper 
                            sx={{ 
                                width: 350, 
                                height: 500, 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                border: '1px solid #D4AF37',
                                borderRadius: 2
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                    Wedding Assistant
                                </Typography>
                                <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Chat Area */}
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {messages.map((msg, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            bgcolor: msg.sender === 'user' ? '#D4AF37' : 'white',
                                            color: msg.sender === 'user' ? 'white' : 'black',
                                            p: 1.5, 
                                            borderRadius: 2,
                                            maxWidth: '80%',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {msg.text}
                                    </Box>
                                ))}
                                {loading && (
                                    <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                                        <CircularProgress size={20} />
                                    </Box>
                                )}
                                <div ref={messagesEndRef} />
                            </Box>

                            <Box component="form" onSubmit={handleSend} sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: 1, alignItems: 'center' }}>
                                <IconButton 
                                    onClick={toggleListening} 
                                    color={isListening ? "error" : "default"}
                                    sx={{ 
                                        animation: isListening ? 'pulse 1.5s infinite' : 'none',
                                        '@keyframes pulse': {
                                            '0%': { boxShadow: '0 0 0 0 rgba(212, 60, 60, 0.7)' },
                                            '70%': { boxShadow: '0 0 0 10px rgba(212, 60, 60, 0)' },
                                            '100%': { boxShadow: '0 0 0 0 rgba(212, 60, 60, 0)' }
                                        }
                                    }}
                                >
                                    {isListening ? <StopIcon /> : <MicIcon />}
                                </IconButton>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={isListening ? "Listening..." : "Ask a question..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <IconButton type="submit" color="primary" disabled={loading || !input.trim()}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fab Button */}
            {!open && (
                <Fab 
                    color="primary" 
                    aria-label="chat" 
                    onClick={() => setOpen(true)}
                    sx={{ 
                        position: 'fixed', 
                        bottom: 20, 
                        right: 20, 
                        zIndex: 1000,
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <SmartToyIcon />
                </Fab>
            )}
        </>
    );
};

export default AiAssistant;
