// paymentController.js
const stripeService = require('../services/stripeService');

/**
 * This controller handles requests related to payments or credit purchases.
 * For example, when a user wants to buy a flowchart credit.
 */
async function purchaseCredit(req, res, next) {
  try {
    // Example: Hard-code the price or retrieve it from your config
    const priceInCents = 299; // $2.99
    const paymentIntent = await stripeService.createPaymentIntent(priceInCents);

    // Return the clientSecret so the frontend can confirm the payment
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: 'Payment intent created successfully',
    });
  } catch (error) {
    next(error); // or handle the error gracefully
  }
}

module.exports = {
  purchaseCredit,
};
