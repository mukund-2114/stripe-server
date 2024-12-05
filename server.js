const express = require('express');
const stripe = require('stripe')('sk_test_51QSkdU08evr3liOEYHXXII2NWUS7gmF07oB4wqn4aSwBFCC6ZWHtLjCvdz9NWzp5ojkgwcVbpYUxgDrHslNAc9QB00Tv4NsUKS');
const ngrok = require('ngrok'); // Import ngrok
const app = express();

app.use(express.json());

app.post('/payment-sheet', async (req, res) => {
  try {
    // Create a new Stripe customer
    const customer = await stripe.customers.create();

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-11-20.acacia' }
    );

    // Create a PaymentIntent for the customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, // Amount in smallest currency unit (e.g., cents for USD)
      currency: 'CAD',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51QSkdU08evr3liOEcMDOUvK9g1Kj7AuxTO8YFDTvQq87ZlU9VIfHhLipbCu9U1iS9ib1xtjLPSygv6Uwok2R8yOj00HDUlKygd'
    });
  } catch (error) {
    console.error('Error creating payment sheet:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server and ngrok
const startServer = async () => {
  const PORT = 3000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    try {
      // Start ngrok and get public URL
      const url = await ngrok.connect(PORT);
      console.log(`Public URL: ${url}`);
    } catch (err) {
      console.error('Error starting ngrok:', err);
    }
  });
};

startServer();
