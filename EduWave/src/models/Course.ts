import mongoose, { Schema } from 'mongoose';

export interface QuizOption {
  text: string;
  is_correct: boolean;
  order_index: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  order_index: number;
  options: QuizOption[];
}

export interface ChapterItem {
  id: string;
  type: 'lesson' | 'quiz';
  title: string;
  content: string;
  order_index: number;
  questions: QuizQuestion[];
  quiz_type?: 'classic' | 'connect' | 'truefalse' | 'memory' | 'scrambled';
}

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  items: ChapterItem[];
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  teacher_id: mongoose.Types.ObjectId;
  teacher_name: string;
  chapters: CourseChapter[];
  createdAt: Date;
}

const QuizOptionSchema = new Schema({
  text: { type: String, required: true },
  is_correct: { type: Boolean, default: false },
  order_index: { type: Number, default: 0 }
});

const QuizQuestionSchema = new Schema({
  question: { type: String, required: true },
  order_index: { type: Number, default: 0 },
  options: [QuizOptionSchema]
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const ChapterItemSchema = new Schema({
  type: { type: String, enum: ['lesson', 'quiz'], required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  order_index: { type: Number, default: 0 },
  questions: [QuizQuestionSchema],
  quiz_type: { type: String, enum: ['classic', 'connect', 'truefalse', 'memory', 'scrambled'], default: 'classic' }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const CourseChapterSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order_index: { type: Number, default: 0 },
  items: [ChapterItemSchema]
}, {
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Informatică' },
  image_url: { type: String, default: '' },
  teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_name: { type: String, required: true },
  chapters: [CourseChapterSchema],
  createdAt: { type: Date, default: Date.now }
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

// Ensure virtuals are included
CourseSchema.virtual('id').get(function () {
  return (this as any)._id.toHexString();
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
