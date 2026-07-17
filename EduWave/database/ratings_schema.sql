-- ===== RATING / FEEDBACK SYSTEM =====

-- Rating-uri pentru cursuri (1-5 stele)
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- RLS
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can see ratings" ON course_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can rate" ON course_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON course_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
