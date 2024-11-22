import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  bankAccountName: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  
  // Company specific fields
  companyName: {
    type: String,
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  fleetSize: {
    type: String,
    trim: true
  },
  
  // Individual specific fields
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  idDocumentPath: {
    type: String,
    trim: true
  },
  carMake: {
    type: String,
    trim: true
  },
  carModel: {
    type: String,
    trim: true
  },
  carYear: {
    type: String,
    trim: true
  },
  
  partnerType: {
    type: String,
    required: true,
    enum: ['individual', 'company'],
    default: 'company'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Partner', partnerSchema);
