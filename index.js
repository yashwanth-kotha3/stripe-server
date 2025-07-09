// index.js (CommonJS version)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripeLib = require("stripe");

dotenv.config(); // ✅ Loads .env

const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stripe server live");
});

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("💰 Payment Request Received:", total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
