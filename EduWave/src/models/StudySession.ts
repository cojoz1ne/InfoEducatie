import mongoose, { Schema } from 'mongoose';

export interface IStudySession {
  id: string;
  user_id: mongoose.Types.ObjectId;
  start_time: Date;
  end_time?: Date;
  duration_minutes: number;
}

const StudySessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date },
  duration_minutes: { type: Number, default: 0 }
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

export default mongoose.models.StudySession || mongoose.model<IStudySession>('StudySession', StudySessionSchema);
