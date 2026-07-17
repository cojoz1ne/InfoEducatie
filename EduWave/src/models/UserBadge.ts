import mongoose, { Schema } from 'mongoose';

export interface IUserBadge {
  id: string;
  user_id: mongoose.Types.ObjectId;
  badge_id: string;
  earned_at: Date;
}

const UserBadgeSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  badge_id: { type: String, ref: 'Badge', required: true }, // String to match Badge ID type
  earned_at: { type: Date, default: Date.now }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

UserBadgeSchema.index({ user_id: 1, badge_id: 1 }, { unique: true });

export default mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
