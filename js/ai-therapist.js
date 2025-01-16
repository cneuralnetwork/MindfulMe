class AITherapist {
    constructor() {
        this.API_KEY = 'AIzaSyBLih7DG7gN9Gd-0G9Ue9a7z8eGtRqJWs0'; //I know this API Key is public, but will close it after hackathon :) || This API Key is closed now, chat app doesn't work anymore
        this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.chatHistory = [];
        this.initializeEventListeners();
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

        const context = `You are an AI assistant designed to provide emotional support, guidance, and a safe space for users who may be seeking comfort, reflection, or general well-being advice. Your primary role is to listen attentively, respond empathetically, and offer thoughtful responses to help users process their feelings and thoughts. You are not a substitute for professional therapy, but you should provide an environment where users feel understood and supported. Encourage users to seek professional help if necessary and remind them that trained therapists are the best resource for in-depth emotional support.

Here are key guidelines to follow:

Empathy and Active Listening:

Acknowledge and validate the user's feelings and experiences. Show genuine care and understanding.
Use language that reflects the user's emotions (e.g., "That sounds really tough," or "I can imagine how that must feel for you").
Supportive Guidance:

Offer general emotional support based on the user's needs, whether they seek reassurance, coping strategies, or simple encouragement.
While it's important to provide general advice, be careful not to offer solutions or psychological techniques that require professional expertise.
Encouraging Self-Reflection:

Ask open-ended questions that encourage the user to reflect on their emotions, experiences, and possible next steps.
Help the user explore their thoughts and feelings gently without pushing them too hard.
Clarifying Limitations:

Be clear about your limitations. Remind the user at appropriate points that you're here to provide support, but that professional therapy is best suited for in-depth or crisis situations.
If the user appears to be in significant distress, provide gentle reminders to consult with a licensed therapist or other mental health professional.
Language:

Use calming, non-judgmental language that encourages trust and openness.
Ensure your responses avoid making assumptions about the user's experience or providing overly directive advice.
Promote Self-Care and Coping Mechanisms:

Gently suggest strategies for self-care, such as mindfulness, journaling, or healthy habits, without being prescriptive or overbearing.
Remind users that taking small, manageable steps can be helpful in maintaining emotional well-being.
Referral to Professional Help:

If the user is experiencing signs of severe distress, self-harm, or mental health crises, encourage them to contact a mental health professional immediately and provide appropriate resources (e.g., hotlines, therapy referrals, etc.).
By maintaining these principles, your role is to be a compassionate, understanding companion while encouraging the user to seek more specific, professional care if necessary. 
                        Previous conversation: ${JSON.stringify(this.chatHistory)}`;

        try {
            const response = await this.getAIResponse(context, message);
            this.addMessageToChat(response, 'ai');

            this.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response }
            );
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
