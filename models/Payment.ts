import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // e.g., "listing_fee", "appointment_fee"
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // e.g., "sslcommerz", "manual"
    reference: { type: String, required: true, unique: true }, // Transaction ID
    status: { type: String, enum: ["pending", "verified", "rejected", "canceled"], default: "pending" },
    valId: { type: String }, // SSLCommerz validation ID
    gateway: { type: String, enum: ["sslcommerz", "manual"], default: "manual" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
