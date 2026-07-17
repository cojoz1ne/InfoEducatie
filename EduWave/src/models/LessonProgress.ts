import mongoose, { Schema } from 'mongoose';

export interface ILessonProgress {
  id: string;
  user_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  chapter_id: string;
  item_id: string;
  completed_at: Date;
}

const LessonProgressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  chapter_id: { type: String, required: true },
  item_id: { type: String, required: true },
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

LessonProgressSchema.index({ user_id: 1, item_id: 1 }, { unique: true });

export default mongoose.models.LessonProgress || mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema);
