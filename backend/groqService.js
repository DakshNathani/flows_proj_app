// backend/groqService.js
const Groq = require('groq-sdk');

// Initialize GROQ client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Function to get AI response from GROQ
async function getGroqResponse(userMessage) {
  try {
    console.log('Sending message to GROQ:', userMessage);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Be friendly, concise, and helpful in your responses.'
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: 'llama3-8b-8192', // Using Llama 3 8B model (fast and good)
      temperature: 0.7,        // Controls creativity (0-2, higher = more creative)
      max_tokens: 1000,        // Maximum response length
      top_p: 1,               // Controls diversity of responses
      stream: false,          // We want complete response, not streaming
    });

    // Extract the response text
    const aiResponse = chatCompletion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response received from GROQ');
    }

    console.log('GROQ response received:', aiResponse.substring(0, 100) + '...');
    return aiResponse;

  } catch (error) {
    console.error('GROQ API Error:', error);
    
    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      return 'Sorry, I\'ve reached my API limit. Please try again later.';
    } else if (error.code === 'invalid_api_key') {
      return 'Sorry, there\'s an issue with my configuration. Please contact support.';
    } else if (error.message?.includes('rate limit')) {
      return 'I\'m receiving too many requests. Please wait a moment and try again.';
    } else {
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  }
}

module.exports = {
  getGroqResponse
};