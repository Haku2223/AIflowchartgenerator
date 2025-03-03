// server/controllers/paymentController.js
const stripeService = require('../services/stripeService');

async function handleStripeWebhook(req, res) {
  try {
    // Let Stripe verify the signature, parse event, etc.
    const event = await stripeService.constructEventFromWebhook(req);

    // Handle different types of events:
    switch (event.type) {
      case 'payment_intent.succeeded':
        // For example, update user’s credits or record a transaction
        console.log('Payment succeeded!', event.data.object);
        break;
      // more events ...
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

module.exports = {
  // existing exports (purchaseCredit, etc.)
  handleStripeWebhook,
};
