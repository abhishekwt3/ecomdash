import mongoose from 'mongoose';

const CostSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  category: { 
    type: String, 
    enum: ['shipping', 'packaging', 'commissions', 'salaries', 'ad-spend', 'tools', 'other'],
    required: true 
  },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['one-time', 'monthly', 'yearly'], default: 'monthly' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Cost', CostSchema);