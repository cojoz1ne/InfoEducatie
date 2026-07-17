-- ===== ADMIN SYSTEM - ROLURI ȘI APROBARE PROFESORI =====

-- 1. Adaugă coloana is_approved pe profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

-- 2. Setăm toți utilizatorii existenți ca aprobați
UPDATE public.profiles SET is_approved = true WHERE is_approved IS NULL;

-- 3. Actualizăm trigger-ul handle_new_user pentru a seta is_approved
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'teacher' THEN false
      ELSE true
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url,
    is_approved = EXCLUDED.is_approved;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreăm trigger-ul
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Policy: Adminii pot actualiza orice profil (aprobare, schimbare rol)
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Policy: Adminii pot vedea toate profilurile (deja există "Anyone can view profiles")
-- Nu e nevoie de altă policy, cea existentă acoperă SELECT.

-- 7. Adăugăm un index pentru căutări rapide pe role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
