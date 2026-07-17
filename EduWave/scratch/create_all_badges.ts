import mongoose from 'mongoose';
import crypto from 'crypto';
import Course from '../src/models/Course';
import Badge from '../src/models/Badge';

const MONGODB_URI = 'mongodb://localhost:27017/eduwave';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Arte Dramatice & Teatru': '🎭',
  'Arte Vizuale': '🎨',
  'Astronomie': '🚀',
  'Biochimie': '🧬',
  'Biologie': '🔬',
  'Botanică': '🌿',
  'Chimie': '🧪',
  'Cinema & Film': '🎬',
  'Criminologie': '🔍',
  'Criptografie': '🔑',
  'Cultură & Civilizație': '🏛️',
  'Cybersecuritate': '🛡️',
  'Design de Interior': '🏠',
  'Design Grafic': '📐',
  'Design Industrial': '⚙️',
  'Drept & Legislație': '⚖️',
  'Ecologie & Mediu': '🌍',
  'Economie': '📈',
  'Educație Fizică & Sport': '⚽',
  'Electronică & Automatizări': '🔌',
  'Farmacie': '💊',
  'Filologie': '✍️',
  'Filosofie': '🧠',
  'Finanțe & Bănci': '💰',
  'Fizică': '⚛️',
  'Fotografie': '📸',
  'Geografie': '🗺️',
  'Geologie': '💎',
  'Informatică': '💻',
  'Inginerie Civilă': '🏗️',
  'Inginerie Mecanică': '⚙️',
  'Inteligență Artificială': '🤖',
  'Istorie': '📜',
  'Jurnalism & Media': '📰',
  'Limba Engleză': '🇬🇧',
  'Limba Franceză': '🇫🇷',
  'Limba Germană': '🇩🇪',
  'Limba Română': '🇷🇴',
  'Literatură': '📚',
  'Marketing & PR': '📣',
  'Matematică': '🧮',
  'Medicină & Sănătate': '🏥',
  'Mitologie': '⚡',
  'Muzică': '🎵',
  'Nutriție & Dietetică': '🍎',
  'Oceanografie': '🐙',
  'Pedagogie': '🎓',
  'Programare Web': '🕸️',
  'Psihologie': '🧠',
  'Robotică': '🤖',
  'Relații Internaționale': '🌐',
  'Sociologie': '👥',
  'Statistică': '📊',
  'Tehnologie & Inovație': '💡',
  'Teologie & Religie': '⛪',
  'Turism & Ospitalitate': '✈️',
  'Zoologie': '🦁'
};

const CATEGORY_COLORS: Record<string, string> = {
  'Informatică': '#3b82f6',
  'Inteligență Artificială': '#8b5cf6',
  'Programare Web': '#06b6d4',
  'Robotică': '#6366f1',
  'Tehnologie & Inovație': '#f59e0b',
  'Chimie': '#10b981',
  'Fizică': '#3b82f6',
  'Biologie': '#10b981',
  'Matematică': '#ef4444',
  'Limba Română': '#ef4444',
  'Limba Engleză': '#3b82f6',
  'Limba Franceză': '#06b6d4',
  'Limba Germană': '#f59e0b',
  'Literatură': '#ec4899',
  'Istorie': '#84cc16',
  'Geografie': '#10b981',
  'Mitologie': '#f59e0b',
  'Medicină & Sănătate': '#ef4444',
  'Psihologie': '#8b5cf6',
  'Sociologie': '#6366f1',
  'Economie': '#10b981',
  'Finanțe & Bănci': '#10b981',
  'Marketing & PR': '#ec4899',
  'Jurnalism & Media': '#8b5cf6',
  'Teologie & Religie': '#a855f7',
  'Turism & Ospitalitate': '#06b6d4',
  'Zoologie': '#10b981',
  'Oceanografie': '#06b6d4',
  'Geologie': '#64748b'
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses. Processing badges...`);

    let createdCount = 0;
    let existingCount = 0;

    for (const course of courses) {
      // Check if badge already exists for this course
      const existingBadge = await Badge.findOne({ course_id: course._id });
      if (existingBadge) {
        existingCount++;
        continue;
      }

      const category = course.category || 'General';
      const icon = CATEGORY_EMOJIS[category] || '🏆';
      const color = CATEGORY_COLORS[category] || '#fbbf24';

      const badgeId = crypto.randomUUID();
      const badge = new Badge({
        _id: badgeId,
        course_id: course._id,
        title: `Absolvent ${course.title}`,
        description: `Felicitări! Ai absolvit cu succes cursul „${course.title}”.`,
        icon: icon,
        color: color,
        badge_type: 'course_complete',
        image_url: ''
      });

      await badge.save();
      createdCount++;
      console.log(`Created badge for course: ${course.title} (ID: ${badgeId})`);
    }

    console.log(`Finished processing. Created: ${createdCount}, Existing: ${existingCount}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
