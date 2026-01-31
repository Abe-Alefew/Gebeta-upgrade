// import { BACKEND_URL } from './client';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// Sends a message to the AI assistant
export const sendMessage = async (userMessage, history = []) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                history: history // Sending history helps with context if backend supports it
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message to chat API:', error);
        throw error;
    }
};
