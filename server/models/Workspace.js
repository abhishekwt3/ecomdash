import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'viewer'], default: 'admin' }
  }],
  settings: {
    currency: { type: String, default: 'USD' }
  }
}, { timestamps: true });

export default mongoose.model('Workspace', WorkspaceSchema);