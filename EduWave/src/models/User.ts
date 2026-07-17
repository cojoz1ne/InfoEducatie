import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // Virtual ID for convenience
  email: string;
  password?: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  is_approved: boolean;
  avatar_url: string;
  bio?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  public_profile: boolean;
  createdAt: Date;
  auth_provider?: 'credentials' | 'google' | 'github';
  is_banned: boolean;
  is_ai_blacklisted: boolean;
  timeout_until?: Date | null;
  mute_until?: Date | null;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
  },
  full_name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_banned: {
    type: Boolean,
    default: false,
  },
  is_ai_blacklisted: {
    type: Boolean,
    default: false,
  },
  timeout_until: {
    type: Date,
    default: null,
  },
  mute_until: {
    type: Date,
    default: null,
  },
  avatar_url: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  email_notifications: {
    type: Boolean,
    default: true,
  },
  push_notifications: {
    type: Boolean,
    default: true,
  },
  public_profile: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  auth_provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials',
  },
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      delete ret.password; // Never return password
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure virtuals are included
UserSchema.virtual('id').get(function () {
  return (this as any)._id.toHexString();
});

// For hot-reload support in Next.js: delete cached model to apply schema updates immediately
if (mongoose.models.User) {
  delete (mongoose.connection.models as any).User;
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', UserSchema);
