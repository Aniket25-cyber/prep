/*
  # Create interviews table

  1. New Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `position` (text)
      - `company` (text)
      - `difficulty` (text)
      - `type` (text)
      - `duration` (integer, in minutes)
      - `score` (integer, 0-100)
      - `feedback` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `interviews` table
    - Add policy for users to manage their own interviews
*/

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  position text NOT NULL,
  company text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  type text NOT NULL CHECK (type IN ('Technical', 'Behavioral', 'System Design', 'HR')),
  duration integer NOT NULL CHECK (duration > 0),
  score integer CHECK (score >= 0 AND score <= 100),
  feedback text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'scheduled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interviews"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews"
  ON interviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS interviews_user_id_idx ON interviews(user_id);
CREATE INDEX IF NOT EXISTS interviews_created_at_idx ON interviews(created_at DESC);
CREATE INDEX IF NOT EXISTS interviews_status_idx ON interviews(status);