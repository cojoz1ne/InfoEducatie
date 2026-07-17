import mongoose, { Schema } from 'mongoose';

export interface IDirectConversation {
  id: string;
  name?: string;
  is_group: boolean;
  participants: mongoose.Types.ObjectId[];
  created_at: Date;
}

const DirectConversationSchema = new Schema({
  name: { type: String, default: '' },
  is_group: { type: Boolean, default: false },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
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

export default mongoose.models.DirectConversation || mongoose.model<IDirectConversation>('DirectConversation', DirectConversationSchema);
