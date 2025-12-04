import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
  activeWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);