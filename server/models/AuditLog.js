import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userRole: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  query: {
    type: Object,
    required: false
  },
  body: {
    type: Object,
    required: false
  },
  responseStatus: {
    type: Number,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ userRole: 1, timestamp: -1 });
auditLogSchema.index({ path: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog; 