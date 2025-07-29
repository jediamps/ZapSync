const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  fullname: {  // Changed from fullName to match your creation code
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false  // Won't be returned in queries by default
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  ip_address: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'staff'],
    default: 'student'
  },
  
  // Location Data
  location: {  // Changed from separate latitude/longitude to nested object
    type: {
      latitude: Number,
      longitude: Number
    },
    default: null
  },
  
  // Device Info
  device_info: {  // Added to match your creation code
    type: {
      device_type: String,
      browser: String,
      screen_width: Number,
      screen_height: Number,
      userAgent: String,
      platform: String
    },
    default: {}
  },
  
  // Security
  captcha_token: {
    type: String,
    required: true
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);  // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;