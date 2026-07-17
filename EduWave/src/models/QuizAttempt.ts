import mongoose, { Schema } from 'mongoose';

export interface IQuizAttempt {
  id: string;
  user_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  item_id: string;
  score: number;
  total: number;
  percentage: number;
  completed_at: Date;
}

const QuizAttemptSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  item_id: { type: String, required: true },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  completed_at: { type: Date, default: Date.now }
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

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
