// server/controllers/flowchartController.js
const chatgptService = require('../services/chatgptService');
const {
  getUserById,
  createUser,
  setFreeCreditUsed,
} = require('../services/supaBaseService');

async function generateFlowchartController(req, res) {
  try {
    const { userId, prompt } = req.body;
    if (!userId || !prompt) {
      return res.status(400).json({ success: false, message: 'Missing userId or prompt.' });
    }

    // 1. Check if user exists
    let user;
    try {
      user = await getUserById(userId);
    } catch (err) {
      // If user doesn't exist, create them
      if (err.details && err.details.includes('No rows found')) {
        user = await createUser(userId);
      } else {
        throw err; // some other error
      }
    }

    // 2. Check if free credit is available
    if (!user.free_credit_used) {
      // They still have their free credit
      const flowchartText = await chatgptService.generateFlowchart(prompt);

      // Mark free credit as used
      await setFreeCreditUsed(userId);

      return res.json({
        success: true,
        freeCreditUsed: false, // they just used it
        flowchartText,
      });
    } else {
      // They used the free credit. Do they have paid credits?
      if (user.credits > 0) {
        // Decrement their credit by 1 and proceed
        // (You'd need a function like "decrementCredit")
        // Example:
        // await decrementCredit(userId);

        const flowchartText = await chatgptService.generateFlowchart(prompt);
        return res.json({
          success: true,
          freeCreditUsed: true,
          flowchartText,
        });
      } else {
        // No credits left
        return res.status(402).json({
          success: false,
          message: 'No credits left. Please purchase a credit.',
        });
      }
    }
  } catch (error) {
    console.error('Error generating flowchart:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  generateFlowchartController,
};
