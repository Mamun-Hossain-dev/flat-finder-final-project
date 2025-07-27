import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId; // User involved in the transaction
  type: 'listing_premium' | 'appointment_fee' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId?: string; // e.g., bKash transaction ID
  description?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['listing_premium', 'appointment_fee', 'other'] },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BDT' },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'completed', 'failed'] },
    referenceId: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
