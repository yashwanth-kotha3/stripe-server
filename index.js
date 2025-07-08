const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

const app = express();

// ✅ Fix CORS properly
app.use(cors({ origin: true }));
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Stripe server live");
});

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("💰 Payment Request Received: ", total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
