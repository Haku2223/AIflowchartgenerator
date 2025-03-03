// server/services/stripeService.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // existing methods (like createPaymentIntent)

  constructEventFromWebhook(req) {
    // If you're verifying signatures, you need the raw body and a Stripe webhook secret
    // But at a minimum, you might parse the event from the request body:
    return new Promise((resolve, reject) => {
      try {
        // If using the raw body + signature (recommended for production):
        // const sig = req.headers['stripe-signature'];
        // const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // For development without signature verification:
        const event = req.body;
        resolve(event);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new StripeService();
