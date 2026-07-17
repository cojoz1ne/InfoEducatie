import mongoose, { Schema } from 'mongoose';

export interface ICourseRating {
  id: string;
  user_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  rating: number;
  created_at: Date;
}

const CourseRatingSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
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

CourseRatingSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export default mongoose.models.CourseRating || mongoose.model<ICourseRating>('CourseRating', CourseRatingSchema);
