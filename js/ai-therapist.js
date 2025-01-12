class AITherapist {
    constructor() {
        this.API_KEY = 'AIzaSyBLih7DG7gN9Gd-0G9Ue9a7z8eGtRqJWs0'; //I know this API Key is public, but will close it after hackathon :)
        this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        this.initializeEventListeners();
        this.loadChatHistory();
    }

    loadChatHistory() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        this.chatHistory.forEach(msg => {
            this.addMessageToChat(msg.content, msg.role);
        });
    }

    initializeEventListeners() {
        const sendButton = document.getElementById('send-message');
        const userInput = document.getElementById('user-input');

        sendButton.addEventListener('click', () => this.handleUserMessage());

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });

        document.querySelectorAll('.topic-btn').forEach(button => {
            button.addEventListener('click', () => {
                userInput.value = button.textContent;
                this.handleUserMessage();
            });
        });
    }

    async handleUserMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();

        if (!message) return;

        this.addMessageToChat(message, 'user');
        userInput.value = '';

        try {
            const response = await this.getAIResponse(this.chatHistory, message);
            this.addMessageToChat(response, 'ai');

            this.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response }
            );
            
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessageToChat(
                'I apologize, but I\'m having trouble responding right now. Please try again later.',
                'ai'
            );
        }
    }

    async getAIResponse(context, message) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: `${context}\n\nUser: ${message}\n\nAssistant:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const escapedMessage = message
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>");
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${escapedMessage}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize AI Therapist when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AITherapist();
}); 