import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ITemporaryListing extends Document {
  title: string;
  description: string;
  images: string[];
  type: 'sale' | 'rent' | 'bachelor';
  location: { area: string; city: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft
  isPremium: boolean;
  ownerId: mongoose.Schema.Types.ObjectId; // Reference to User model
}

const TemporaryListingSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    type: { type: String, required: true, enum: ['sale', 'rent', 'bachelor'] },
    location: {
      area: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
    },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    size: { type: Number, required: true, min: 0 },
    isPremium: { type: Boolean, default: false },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const TemporaryListing: Model<ITemporaryListing> = models.TemporaryListing || mongoose.model<ITemporaryListing>('TemporaryListing', TemporaryListingSchema);

export default TemporaryListing;
