-- Update RLS policies for student_subject_analysis table to work with student auth system

-- Drop existing policies
DROP POLICY IF EXISTS "Students can view their own subject analysis" ON student_subject_analysis;
DROP POLICY IF EXISTS "Students can insert their own subject analysis" ON student_subject_analysis;
DROP POLICY IF EXISTS "Students can update their own subject analysis" ON student_subject_analysis;
DROP POLICY IF EXISTS "Students can delete their own subject analysis" ON student_subject_analysis;

-- Create new policies that work with both student_id in JWT and auth.uid()
CREATE POLICY "Students can view their own subject analysis" ON student_subject_analysis
  FOR SELECT USING (
    student_id::text = COALESCE(auth.jwt() ->> 'student_id', auth.uid()::text)
  );

CREATE POLICY "Students can insert their own subject analysis" ON student_subject_analysis
  FOR INSERT WITH CHECK (
    student_id::text = COALESCE(auth.jwt() ->> 'student_id', auth.uid()::text)
  );

CREATE POLICY "Students can update their own subject analysis" ON student_subject_analysis
  FOR UPDATE USING (
    student_id::text = COALESCE(auth.jwt() ->> 'student_id', auth.uid()::text)
  );

CREATE POLICY "Students can delete their own subject analysis" ON student_subject_analysis
  FOR DELETE USING (
    student_id::text = COALESCE(auth.jwt() ->> 'student_id', auth.uid()::text)
  );