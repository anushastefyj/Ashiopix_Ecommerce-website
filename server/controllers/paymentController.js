import Stripe from 'stripe';

let stripeClient;
const getStripe = () => {
  if (!stripeClient) {
    // If key is dummy/placeholder, we use dummy value gracefully for test/mocking
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
    stripeClient = new Stripe(key.startsWith('sk_test_') ? key : 'sk_test_mock');
  }
  return stripeClient;
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/payments/intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  try {
    const stripe = getStripe();
    
    // In actual Stripe SDK, if we pass sk_test_mock it fails, so let's mock it if the secret key is mock
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('xxxxx')) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // amount in cents
        currency,
        metadata: { integration_check: 'accept_a_payment' },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
    } else {
      // Mocked payment intent for local setup/testing when key is not set
      res.json({
        clientSecret: `pi_mock_secret_${Math.random().toString(36).substr(2, 9)}`,
        id: `pi_mock_${Math.random().toString(36).substr(2, 9)}`,
        mock: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
