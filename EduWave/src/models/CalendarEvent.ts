import mongoose, { Schema } from 'mongoose';

export interface ICalendarEvent {
  id: string;
  user_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  type: string; // Curs, Evaluare, Quiz, Studiu, etc.
  color: string; // Hex color code
  created_at: Date;
}

const CalendarEventSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, default: '#1e6fd9' },
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

export default mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
