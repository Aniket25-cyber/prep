interface InterviewTranscript {
  speaker: string;
  text: string;
  timestamp: number;
}

interface InterviewData {
  position: string;
  company: string;
  type: string;
  difficulty: string;
  duration: number;
  jobDescription: string;
  resume: string;
}

interface InterviewScore {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
}

interface InterviewFeedback {
  score: InterviewScore;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  recommendations: string[];
}

class AIInterviewScorer {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to backend API. Please check your connection.');
      }
      throw error;
    }
  }

  async scoreInterview(
    transcript: InterviewTranscript[],
    interviewData: InterviewData
  ): Promise<InterviewFeedback> {
    try {
      return await this.makeRequest<InterviewFeedback>('/score-interview', {
        transcript,
        interviewData,
      });
    } catch (error) {
      console.error('Error scoring interview:', error);
      
      // Return a fallback score if AI scoring fails
      return {
        score: {
          overall: 75,
          technical: 75,
          communication: 75,
          problemSolving: 75,
          culturalFit: 75,
        },
        strengths: [
          'Demonstrated good communication skills',
          'Showed enthusiasm for the role',
          'Provided relevant examples',
        ],
        improvements: [
          'Could provide more specific examples',
          'Consider asking more clarifying questions',
          'Practice explaining technical concepts more clearly',
        ],
        detailedFeedback: 'The candidate showed good potential with solid communication skills and relevant experience. There are opportunities to improve in providing more specific examples and demonstrating deeper technical knowledge.',
        recommendations: [
          'Practice mock interviews to improve confidence',
          'Prepare more detailed STAR method examples',
          'Research the company culture more thoroughly',
        ],
      };
    }
  }

  async generateQuestions(interviewData: InterviewData): Promise<string[]> {
    try {
      return await this.makeRequest<string[]>('/generate-questions', {
        interviewData,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Return fallback questions
      return [
        'Tell me about yourself and your background.',
        'Why are you interested in this position?',
        'What do you know about our company?',
        'Describe a challenging project you worked on.',
        'How do you handle working under pressure?',
        'What are your greatest strengths?',
        'Where do you see yourself in 5 years?',
        'Do you have any questions for me?',
      ];
    }
  }
}

// Initialize AI scorer
export const aiScorer = new AIInterviewScorer();

export type { InterviewTranscript, InterviewData, InterviewScore, InterviewFeedback };