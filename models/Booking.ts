import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  buyerId: mongoose.Schema.Types.ObjectId;
  listingId: mongoose.Schema.Types.ObjectId;
  amount: number;
  bookingType: 'premium' | 'normal';
  status: 'pending' | 'completed' | 'cancelled';
  paymentReferenceId?: string;
  bookedAt: Date;
}

const BookingSchema: Schema = new Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlatListing',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['premium', 'normal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentReferenceId: {
    type: String,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
