import mongoose, { Schema } from 'mongoose';

export interface INotification {
  user_id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: Date;
}

const NotificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'system' },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
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

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
