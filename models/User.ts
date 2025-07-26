// lib/models/User.ts
import mongoose from "mongoose";

const WarningSchema = new mongoose.Schema({
  type: { type: String, enum: ["yellow", "red"], required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller", "tenant"],
      default: "buyer",
    },
    isVerified: { type: Boolean, default: false },
    nidNumber: String,
    nidImage: String,
    profileImage: String,
    warnings: [WarningSchema],
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
