import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import dotenv from "dotenv"

// export const paymentGateway = async (req, res, next) => {
//   try {
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_SECRET,
//     });

//     const razorpayOrder = await razorpay.orders.create({
//       amount: req.body.totalPrice*100,          // in paise
//       currency: "INR"
//     });

//     if (!razorpayOrder) {
//       return res.status(500).send("Error, razorpayOrder empty");
//     }

//     req.razorpayOrder = razorpayOrder;
//     return next();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Error creating Razorpay order");
//   }
// };

export const createRazorpayOrder = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const order = await razorpay.orders.create({
      amount: Math.round(Number(totalPrice) * 100),
      currency: "INR",
      // receipt,
    });
    if (!order) return res.status(500).send("Failed to create Razorpay order");
    return res.status(200).json({ razorpayOrder: order });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error creating Razorpay order");
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, orderItems, totalPrice } = req.body;

    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generated !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      paymentStatus: "paid",
      status: "pending",
    });
    const createdOrder = await order.save();

    return res.status(201).json({ order: createdOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error verifying payment" });
  }
};