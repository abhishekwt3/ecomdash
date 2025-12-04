import mongoose from 'mongoose';

const MetricSnapshotSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  platform: { type: String, required: true }, // 'summary', 'shopify', 'meta', 'ga4'
  date: { type: Date, required: true },
  
  // Flexible data structure to hold varied metrics
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

MetricSnapshotSchema.index({ workspace: 1, platform: 1, date: -1 });

export default mongoose.model('MetricSnapshot', MetricSnapshotSchema);