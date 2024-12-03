const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // To load environment variables from a `.env` file

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in a `.env` file
});
const openai = new OpenAIApi(configuration);

// Route to generate dishes
app.post('/generate-dishes', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call the OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Use the appropriate model
      prompt: prompt,
      max_tokens: 100, // Adjust the token limit as necessary
      temperature: 0.7, // Creativity level
    });

    // Parse the OpenAI response
    const suggestions = response.data.choices[0].text.trim().split('\n').filter(Boolean);

    // Send the suggestions back to the client
    res.status(200).json({ dishes: suggestions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate dishes. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});