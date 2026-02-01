import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },

  razorpayOrderId: {
    type: String,
    required: true,
  },

  paymentId: {
    type: String,
    unique: true,
  },

  signature: {
    type: String,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: 'INR',
  },

  paymentMethod: {
    type: String,
  },

  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
