// stripeService.js
const Stripe = require('stripe');

class StripeService {
  constructor() {
    // Set up the Stripe client
    this.stripe = Stripe(process.env.STRIPE_SECRET_KEY); // load from .env or environment
  }

  async createPaymentIntent(amount, currency = 'usd') {
    try {
      // Create a Payment Intent with the desired amount (in cents), currency, etc.
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,       // e.g. 299 for $2.99
        currency: currency,   // e.g. 'usd'
        // any additional payment intent options
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Add more methods as needed, e.g., handling webhooks, refunds, etc.
}

module.exports = new StripeService();
