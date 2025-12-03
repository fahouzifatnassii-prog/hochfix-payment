import express from "express";
import Stripe from "stripe";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Stripe prend la clé de Render automatiquement
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Render impose d’écouter sur process.env.PORT
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running!");
});
