import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import LessonProgress from '@/models/LessonProgress';
import QuizAttempt from '@/models/QuizAttempt';
import StudySession from '@/models/StudySession';
import UserBadge from '@/models/UserBadge';
import Badge from '@/models/Badge';
import Course from '@/models/Course';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Force model registration — needed because .populate('course_id') references
    // the 'Course' model implicitly, and without a direct usage the import can be
    // tree-shaken by the bundler, causing MissingSchemaError at runtime.
    void Course;

    // 1. Quiz Attempts (avgScore, scoreHistory)
    const attempts = await QuizAttempt.find({ user_id: user._id }).sort({ completed_at: -1 });
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / attempts.length) 
      : 0;
    const scoreHistory = attempts.map(a => ({
      created_at: a.completed_at,
      score: a.percentage
    }));

    // 2. Study Sessions (totalTime, timeHistory, streak, activeDays)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const sessions = await StudySession.find({
      user_id: user._id,
      start_time: { $gte: fourteenDaysAgo }
    }).sort({ start_time: -1 });

    const totalTime = sessions.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);

    const timeMap: Record<string, number> = {};
    sessions.forEach(s => {
      const dateStr = new Date(s.start_time).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
      timeMap[dateStr] = (timeMap[dateStr] || 0) + (s.duration_minutes || 0);
    });
    const timeHistory = Object.entries(timeMap).map(([date, mins]) => ({ date, mins }));

    // Streak & active days this week
    const allSessions = await StudySession.find({ user_id: user._id }).sort({ start_time: -1 });
    const uniqueDays = Array.from(new Set(allSessions.map(s => new Date(s.start_time).toDateString())));

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (uniqueDays.includes(today) || uniqueDays.includes(yesterday)) {
      let current = uniqueDays.includes(today) ? new Date() : new Date(Date.now() - 86400000);
      while (uniqueDays.includes(current.toDateString())) {
        streak++;
        current.setDate(current.getDate() - 1);
      }
    }

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0,0,0,0);

    const weekDays = [false, false, false, false, false, false, false];
    uniqueDays.forEach(d => {
      const date = new Date(d);
      if (date >= startOfWeek) {
        let idx = date.getDay() - 1;
        if (idx === -1) idx = 6;
        weekDays[idx] = true;
      }
    });

    // 3. Course count and Active Courses progress
    const enrollments = await Enrollment.find({ user_id: user._id }).populate('course_id');
    const courseCount = enrollments.length;

    const activeCourses = [];
    for (const e of enrollments) {
      const course = e.course_id as any;
      if (!course) continue;

      let courseProgress = 0;
      let totalItems = 0;
      if (course.chapters && course.chapters.length > 0) {
        course.chapters.forEach((ch: any) => {
          if (ch.items) totalItems += ch.items.length;
        });
      }

      if (totalItems > 0) {
        const completedCount = await LessonProgress.countDocuments({
          user_id: user._id,
          course_id: course._id
        });
        courseProgress = (completedCount / totalItems) * 100;
      } else {
        courseProgress = 100;
      }

      activeCourses.push({
        id: course._id.toString(),
        title: course.title,
        teacher: course.teacher_name || 'Profesor EduWave',
        image: course.image_url || 'https://images.unsplash.com/photo-1501504905953-f87540c3081c?w=800',
        progress: Math.min(Math.round(courseProgress), 100),
        timeLeft: 'Activ'
      });
    }

    // 4. Badges (earned user badges populated with badge info)
    const userBadges = await UserBadge.find({ user_id: user._id }).lean();
    const badgeIds = userBadges.map(ub => ub.badge_id);
    const badgesInfo = await Badge.find({ _id: { $in: badgeIds } }).lean();
    const badgesMap = new Map(badgesInfo.map(b => [b._id, b]));

    const populatedBadges = userBadges.map((ub: any) => ({
      ...ub,
      id: ub._id.toString(),
      badges: badgesMap.get(ub.badge_id) || null
    })).filter(b => b.badges !== null);

    // 5. Daily Missions Notifications Check
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Quest 1: Studiază cel puțin 15 minute
      const todaySessions = sessions.filter(s => new Date(s.start_time) >= todayStart);
      const studyTimeToday = todaySessions.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
      if (studyTimeToday >= 15) {
        const existingNotif = await Notification.findOne({
          user_id: user._id,
          type: 'quest_study_time',
          created_at: { $gte: todayStart }
        });
        if (!existingNotif) {
          await Notification.create({
            user_id: user._id,
            title: 'Misiune Îndeplinită',
            content: 'Ai studiat cel puțin 15 minute astăzi. Continuă tot așa!',
            type: 'quest_study_time'
          });
        }
      }

      // Quest 2: Finalizează cel puțin un quiz
      const todayQuizzes = attempts.filter(a => new Date(a.completed_at) >= todayStart);
      if (todayQuizzes.length > 0) {
        const existingNotif = await Notification.findOne({
          user_id: user._id,
          type: 'quest_quiz_complete',
          created_at: { $gte: todayStart }
        });
        if (!existingNotif) {
          await Notification.create({
            user_id: user._id,
            title: 'Misiune Îndeplinită',
            content: 'Ai finalizat un test astăzi și ți-ai testat cunoștințele.',
            type: 'quest_quiz_complete'
          });
        }
      }

      // Quest 3: Înscrie-te la minimum un curs
      let hasEnrolled = courseCount > 0;
      const existingNotif = await Notification.findOne({
        user_id: user._id,
        type: 'quest_enrollment'
      });
      
      if (existingNotif) {
        hasEnrolled = true;
      }

      if (courseCount > 0 && !existingNotif) {
        await Notification.create({
          user_id: user._id,
          title: 'Misiune Îndeplinită',
          content: 'Te-ai înscris la primul tău curs pe platforma EduWave.',
          type: 'quest_enrollment'
        });
        hasEnrolled = true;
      }
    } catch (notifErr) {
      console.error('Error handling daily mission notifications:', notifErr);
    }

    // Determine hasEnrolled outside try-catch to be safe
    let hasEnrolledFinal = courseCount > 0;
    try {
      const checkNotif = await Notification.findOne({
        user_id: user._id,
        type: 'quest_enrollment'
      });
      if (checkNotif) {
        hasEnrolledFinal = true;
      }
    } catch (e) {}

    return NextResponse.json({
      avgScore,
      scoreHistory,
      totalStudyTime: totalTime,
      timeHistory,
      courseCount,
      hasEnrolled: hasEnrolledFinal,
      activeCourses,
      badges: populatedBadges,
      streak,
      activeDaysThisWeek: weekDays
    });

  } catch (error: any) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
