import mongoose from 'mongoose';

const IntegrationSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  platform: { 
    type: String, 
    enum: ['shopify', 'meta-ads', 'google-analytics'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  lastSyncAt: { type: Date },
  platformId: { type: String },
  
  // Encrypted Credentials
  credentials: {
    accessToken: { type: String }, 
    refreshToken: { type: String },
    shopUrl: { type: String },
    adAccountId: { type: String },
    propertyId: { type: String },
    iv: { type: String } // Stores the IV for decryption
  }
}, { timestamps: true });

IntegrationSchema.index({ workspace: 1, platform: 1 }, { unique: true });

export default mongoose.model('Integration', IntegrationSchema);