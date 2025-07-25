import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Placed" },
    payment: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;