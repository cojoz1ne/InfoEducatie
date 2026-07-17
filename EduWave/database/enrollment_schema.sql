-- ===== ENROLLMENT & SCORING SYSTEM =====

-- Înscrieri la cursuri
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Rezultate quiz-uri
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES chapter_items(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Badge-uri (definite de profesori)
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Insignă',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🏆',
  color TEXT DEFAULT '#fbbf24',
  badge_type TEXT NOT NULL CHECK (badge_type IN ('course_complete', 'quiz_complete')) DEFAULT 'course_complete',
  quiz_item_id UUID REFERENCES chapter_items(id) ON DELETE SET NULL,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Badge-uri câștigate de elevi
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- ===== RLS =====
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own enrollments" ON enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can enroll" ON enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unenroll" ON enrollments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users see quiz attempts" ON quiz_attempts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can submit quiz" ON quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz attempts" ON quiz_attempts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can see badges" ON badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert badges" ON badges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update badges" ON badges FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete badges" ON badges FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users see earned badges" ON user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can award badges" ON user_badges FOR INSERT TO authenticated WITH CHECK (true);
