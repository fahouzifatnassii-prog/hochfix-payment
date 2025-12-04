import express from "express";
import Stripe from "stripe";

const app = express();
app.use(express.json());

// Servir les fichiers du dossier "frontend"
app.use(express.static("frontend"));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Pourboire" },
            unit_amount: amount
          },
          quantity: 1,
        },
      ],

      // 🚀 URLs correctes
      success_url: "https://hochfix-payment.onrender.com/thank-you.html",
      cancel_url: "https://hochfix-payment.onrender.com/cancel.html",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running!");
});
