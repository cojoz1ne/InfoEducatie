import mongoose, { Schema } from 'mongoose';

export interface IEnrollment {
  id: string;
  user_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  enrolled_at: Date;
}

const EnrollmentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolled_at: { type: Date, default: Date.now }
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

EnrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
