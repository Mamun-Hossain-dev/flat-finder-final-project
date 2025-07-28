import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ITemporaryUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'seller' | 'buyer' | 'tenant';
  nidNumber?: string;
  nidImage?: string;
  createdAt: Date;
}

const TemporaryUserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['admin', 'seller', 'buyer', 'tenant'] },
    nidNumber: { type: String, unique: true },
    nidImage: { type: String },
  },
  { timestamps: true }
);

const TemporaryUser: Model<ITemporaryUser> = models.TemporaryUser || mongoose.model<ITemporaryUser>('TemporaryUser', TemporaryUserSchema);

export default TemporaryUser;
