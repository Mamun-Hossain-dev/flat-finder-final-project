import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IFlatListing extends Document {
  title: string;
  description: string;
  images: string[];
  type: 'sale' | 'rent' | 'bachelor';
  location: {
    area: string;
    city: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft
  isPremium: boolean;
  ownerId: mongoose.Schema.Types.ObjectId; // Reference to User model
  views: number;
  available: boolean;
  isApproved: boolean; // For admin approval
}

const FlatListingSchema: Schema = new Schema(
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
    views: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FlatListing: Model<IFlatListing> = models.FlatListing || mongoose.model<IFlatListing>('FlatListing', FlatListingSchema);

export default FlatListing;