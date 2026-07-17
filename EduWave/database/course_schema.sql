-- ===== COURSE BUILDER SCHEMA =====

-- Capitolele unui curs
CREATE TABLE IF NOT EXISTS course_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Capitol Nou',
  description TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Elementele unui capitol (lecții sau quiz-uri)
CREATE TABLE IF NOT EXISTS chapter_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES course_chapters(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lesson', 'quiz')),
  title TEXT NOT NULL DEFAULT 'Element Nou',
  content TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Întrebările unui quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES chapter_items(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Opțiunile de răspuns
CREATE TABLE IF NOT EXISTS quiz_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ===== RLS POLICIES =====

ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;

-- Toți pot vedea
CREATE POLICY "Anyone can view chapters" ON course_chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view items" ON chapter_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view questions" ON quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view options" ON quiz_options FOR SELECT TO authenticated USING (true);

-- Autentificați pot insera/actualiza/șterge
CREATE POLICY "Auth insert chapters" ON course_chapters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update chapters" ON course_chapters FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete chapters" ON course_chapters FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert items" ON chapter_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update items" ON chapter_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete items" ON chapter_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert questions" ON quiz_questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update questions" ON quiz_questions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete questions" ON quiz_questions FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert options" ON quiz_options FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update options" ON quiz_options FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete options" ON quiz_options FOR DELETE TO authenticated USING (true);

-- Adaugă politica UPDATE pe courses (dacă nu există)
DO $$ BEGIN
  CREATE POLICY "Auth update courses" ON courses FOR UPDATE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
