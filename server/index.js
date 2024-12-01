require('dotenv').config({ path: '.env.local' });
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(bodyParser.json());
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Server started successfully');
});

app.post('/api/create-checkout-session', async (req, res) => {
  const { posting } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: posting.postingName,
            },
            unit_amount: posting.price * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/posting-list`,
      cancel_url: `${req.headers.origin}/posting-list`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));