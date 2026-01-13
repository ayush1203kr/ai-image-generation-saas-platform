import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import transactionModel from "../models/transactionModel.js";

/* ===============================
   AUTH
================================ */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   USER CREDITS
================================ */
const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch {
    res.json({ success: false, message: "Failed to load credits" });
  }
};

/* ===============================
   RAZORPAY (LAZY INIT ✅)
================================ */
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in environment");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/* ===============================
   CREATE ORDER
================================ */
const paymentRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing details" });
    }

    let plan, credits, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Pro":
        plan = "Pro";
        credits = 500;
        amount = 50;
        break;
      case "Enterprise":
        plan = "Enterprise";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid plan" });
    }

    const transaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
    });

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: transaction._id.toString(),
    });

    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ===============================
   VERIFY PAYMENT
================================ */
const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment data" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const transaction = await transactionModel.findById(order.receipt);

    if (!transaction || transaction.payment) {
      return res.json({ success: false, message: "Invalid transaction" });
    }

    const user = await userModel.findById(transaction.userId);

    user.creditBalance =
      Number(user.creditBalance) + Number(transaction.credits);
    await user.save();

    transaction.payment = true;
    await transaction.save();

    res.json({
      success: true,
      message: "Payment verified & credits added",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
};
