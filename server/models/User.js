import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  passwordHash: {
    type: String,
    // Optional: users who sign in with Google OAuth have no password.
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email',
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  passwordResetOtp: {
    type: String,
  },
  passwordResetExpiresAt: {
    type: Date,
  },
  passwordResetAttempts: {
    type: Number,
    default: 0,
  },
  savedTrips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
  ],
  createdAt: {
    type: Date,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook: set createdAt on first save
userSchema.pre('save', function () {
  if (this.isNew) {
    this.createdAt = new Date();
  }
});

const User = mongoose.model('User', userSchema);
export default User;
