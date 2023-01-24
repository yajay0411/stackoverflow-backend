import express from 'express';
import auth from "../middlewares/auth.js";
import User from "../models/auth.js";
import { stripe } from "../Utils/Stripe.js";

const router = express.Router();

router.get("/prices", async (req, res) => {
    const prices = await stripe.prices.list({
        apiKey: process.env.STRIPE_SECRET_KEY
    });
    res.json(prices);
});

router.post("/session", async (req, res) => {
    const { email, id } = req.body
    console.log(email)
    console.log(id.id)
    const user = await User.findOne({email})
    // console.log(user)
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ["card"],
        line_items: [
            {
                price: `${id.id}`,
                quantity: 1
            }
        ],
        success_url: `http://localhost:5173/`,
        cancel_url: `http://localhost:5173/subscriptionplan/`,
        customer: user?.stripeCustomer?._id
    }, {
        apiKey: process.env.STRIPE_SECRET_KEY
    })
    return res.json(session)
});

export default router;