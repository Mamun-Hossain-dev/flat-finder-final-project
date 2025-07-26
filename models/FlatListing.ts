import mongoose from "mongoose";

const FlatListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["sale", "rent", "bachelor"], required: true },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    location: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: [Number],
    },
    images: [String],
    amenities: [String],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isSold: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FlatListing ||
  mongoose.model("FlatListing", FlatListingSchema);
