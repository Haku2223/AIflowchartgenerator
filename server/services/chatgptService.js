// chatgptService.js
const { Configuration, OpenAIApi } = require('openai');

// This service handles interactions with OpenAI's ChatGPT API
class ChatGPTService {
  constructor() {
    // Set up the OpenAI configuration
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // load from .env or environment
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateFlowchart(prompt) {
    try {
      // Example call to OpenAI's text completion or chat endpoint
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      });

      // Return the text from the response
      const aiMessage = response.data.choices[0].message?.content;
      return aiMessage;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
}

module.exports = new ChatGPTService();
