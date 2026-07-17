import mongoose, { Schema } from 'mongoose';

export interface IDirectMessage {
  id: string;
  conversation_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  content: string;
  created_at: Date;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  waveform?: number[];
}

const DirectMessageSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'DirectConversation', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false, default: '' },
  file_url: { type: String, required: false },
  file_name: { type: String, required: false },
  file_type: { type: String, required: false },
  waveform: { type: [Number], required: false },
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

// For hot-reload support in Next.js: delete cached model to apply schema updates immediately
if (mongoose.models.DirectMessage) {
  delete (mongoose.connection.models as any).DirectMessage;
  delete mongoose.models.DirectMessage;
}

export default mongoose.model<IDirectMessage>('DirectMessage', DirectMessageSchema);
