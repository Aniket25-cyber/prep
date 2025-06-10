export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  position: string;
  company: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Technical' | 'Behavioral' | 'System Design' | 'HR';
  duration: number;
  score?: number;
  feedback?: string;
  created_at: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export interface InterviewSetup {
  position: string;
  company: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Technical' | 'Behavioral' | 'System Design' | 'HR';
  duration: number;
  jobDescription: string;
  resume: string;
  additionalInfo?: string;
}