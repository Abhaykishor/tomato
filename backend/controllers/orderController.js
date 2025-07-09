import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx", // Replace with your Razorpay test key
    key_secret: process.env.RAZORPAY_KEY_SECRET || "xxxxxxxxxxxxxxxxxxxxxx" // Replace with your Razorpay test secret
});

//config variables
const currency = "INR";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using Razorpay
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const amountInPaise = (req.body.amount) * 100;
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: currency,
            receipt: newOrder._id.toString(),
            payment_capture: 1
        });

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: currency,
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx"
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ deleted: false });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, deleted: false });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

const deleteOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { deleted: true });
        res.json({ success: true, message: "Order deleted (soft)" });
    } catch (error) {
        res.json({ success: false, message: "Error deleting order" });
    }
}
const restoreOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { deleted: false });
        res.json({ success: true, message: "Order restored" });
    } catch (error) {
        res.json({ success: false, message: "Error restoring order" });
    }
}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod, deleteOrder, restoreOrder }