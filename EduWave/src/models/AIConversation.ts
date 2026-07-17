import mongoose, { Schema, Document } from 'mongoose';

export interface IAIConversation extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  title: string;
  created_at: Date;
}

const AIConversationSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
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

AIConversationSchema.virtual('id').get(function () {
  return (this as any)._id.toHexString();
});

export default mongoose.models.AIConversation || mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
