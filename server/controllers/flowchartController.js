/**
 * @file server/controllers/flowchartController.js
 * @description
 * This controller handles flowchart generation requests.
 * It checks user credits (free or paid), calls the ChatGPT service, and returns
 * Mermaid-compatible flowchart code to the frontend.
 *
 * @notes
 * - If free credit is unused, the user can generate once without charge.
 * - If free credit is used, we decrement paid credits if available.
 * - If no credits remain, return 402 Payment Required error.
 * - Errors are logged on the server side and a structured JSON response is returned.
 */

const chatgptService = require('../services/chatgptService');
const {
  getUserById,
  createUser,
  setFreeCreditUsed,
  decrementCredit,
} = require('../services/supaBaseService');

/**
 * @function generateFlowchartController
 * @description
 * Express handler for the POST /api/flowcharts/generate route.
 * 1. Validates request input (userId, prompt).
 * 2. Fetches or creates the user in Supabase.
 * 3. Determines whether the free credit is available or if paid credits are needed.
 * 4. Calls ChatGPT to generate the Mermaid code from the prompt.
 * 5. Returns the generated flowchart code or an error if credits are insufficient.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} JSON response containing success, flowchartText, etc.
 */
async function generateFlowchartController(req, res) {
  try {
    const { userId, prompt } = req.body;
    if (!userId || !prompt) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing userId or prompt.' });
    }

    // 1. Check if user exists, else create them
    let user;
    try {
      user = await getUserById(userId);
    } catch (err) {
      // If no user found, create a new record
      if (err.details && err.details.includes('No rows found')) {
        user = await createUser(userId);
      } else {
        // Some other error from Supabase
        throw err;
      }
    }

    // 2. Decide if free credit applies or if we need to use paid credits
    if (!user.free_credit_used) {
      // They still have their free credit
      const flowchartText = await chatgptService.generateFlowchart(prompt);

      // Mark the free credit as used
      await setFreeCreditUsed(userId);

      return res.json({
        success: true,
        freeCreditUsed: false, // indicates they just used the free one
        flowchartText,
      });
    } else {
      // They've used the free credit. Check if they have paid credits
      if (user.credits > 0) {
        // Decrement a paid credit
        await decrementCredit(userId);

        // Then generate the flowchart
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
