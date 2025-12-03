import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Charger la clé Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Render donne automatiquement PORT dans process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
