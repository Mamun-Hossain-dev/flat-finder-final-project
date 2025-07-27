import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IComplaint extends Document {
  userId: mongoose.Types.ObjectId; // User who filed the complaint
  targetId: mongoose.Types.ObjectId; // User or Listing ID being complained about
  targetType: 'user' | 'listing';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, required: true, enum: ['user', 'listing'] },
    reason: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'reviewed', 'resolved', 'rejected'] },
  },
  { timestamps: true }
);

const Complaint: Model<IComplaint> = models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

export default Complaint;
