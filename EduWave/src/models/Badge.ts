import mongoose, { Schema } from 'mongoose';

export interface IBadge {
  _id: string; // Allow string IDs for UUID matching
  id: string;
  course_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge_type: 'course_complete' | 'quiz_complete';
  quiz_item_id?: string;
  image_url: string;
  created_at: Date;
}

const BadgeSchema = new Schema({
  _id: { type: String, required: true }, // Override default ObjectId with String to support UUIDs
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏆' },
  color: { type: String, default: '#fbbf24' },
  badge_type: { type: String, enum: ['course_complete', 'quiz_complete'], default: 'course_complete' },
  quiz_item_id: { type: String, default: '' },
  image_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);
