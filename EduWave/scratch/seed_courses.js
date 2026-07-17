import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwave';
const DATA_FILE = path.join(process.cwd(), 'scratch', 'courses.json');

async function seed() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const { courses } = JSON.parse(raw);

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    let teacher = await User.findOne({ role: { $in: ['teacher', 'admin'] } });
    if (!teacher) {
      teacher = await User.findOne();
    }
    if (!teacher) {
      teacher = new User({
        email: 'profesor@eduwave.ro',
        full_name: 'Prof. Andrei Ionescu',
        role: 'teacher',
        is_approved: true
      });
      await teacher.save();
    }
    console.log(`Profesor folosit: ${teacher.full_name} (${teacher._id})`);

    for (const c of courses) {
      const existed = await Course.findOne({ title: c.title });
      if (existed) {
        await Course.deleteOne({ _id: existed._id });
        console.log(`Înlocuiesc (exista deja): ${c.title}`);
      }

      const chapters = (c.chapters || []).map((ch, ci) => ({
        title: ch.title,
        description: ch.description || '',
        order_index: ci,
        items: (ch.items || []).map((it, ii) => ({
          type: it.type,
          title: it.title,
          content: it.content || '',
          order_index: ii,
          quiz_type: it.quiz_type || 'classic',
          questions: (it.questions || []).map((q, qi) => ({
            question: q.question,
            order_index: qi,
            options: (q.options || []).map((o, oi) => ({
              text: o.text,
              is_correct: !!o.is_correct,
              order_index: oi
            }))
          }))
        }))
      }));

      const newCourse = new Course({
        title: c.title,
        description: c.description || '',
        category: c.category || 'Informatică',
        image_url: c.image_url || '',
        teacher_id: teacher._id,
        teacher_name: teacher.full_name,
        chapters
      });

      await newCourse.save();
      console.log(`Adăugat: ${c.title}`);
    }

    console.log('Gata!');
    process.exit(0);
  } catch (error) {
    console.error('Eroare:', error);
    process.exit(1);
  }
}

seed();
