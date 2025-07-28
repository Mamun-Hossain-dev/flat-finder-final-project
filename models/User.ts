import mongoose from "mongoose";

export interface IWarning {
  type: "yellow" | "red";
  reason: string;
  date: Date;
}

export interface IUser extends mongoose.Document {
  firebaseUid: string;
  email: string;
  name: string;
  phone: string;
  role: "admin" | "buyer" | "seller" | "tenant";
  isVerified: boolean;
  nidNumber?: string;
  nidImage?: string;
  profileImage?: string;
  warnings: IWarning[];
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WarningSchema = new mongoose.Schema<IWarning>({
  type: { type: String, enum: ["yellow", "red"], required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller", "tenant"],
      default: "buyer",
    },
    isVerified: { type: Boolean, default: false },
    nidNumber: { type: String, unique: true },
    nidImage: String,
    profileImage: String,
    warnings: [WarningSchema],
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);