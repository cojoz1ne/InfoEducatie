import mongoose, { Schema, Document } from 'mongoose';

export interface IAIMessage extends Document {
  id: string;
  conversation_id: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

const AIMessageSchema: Schema = new Schema({
  conversation_id: {
    type: Schema.Types.ObjectId,
    ref: 'AIConversation',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
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

AIMessageSchema.virtual('id').get(function () {
  return (this as any)._id.toHexString();
});

export default mongoose.models.AIMessage || mongoose.model<IAIMessage>('AIMessage', AIMessageSchema);
