import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Interview } from '../types';

interface InterviewStats {
  totalInterviews: number;
  averageScore: number;
  totalTime: number;
  thisWeekInterviews: number;
  improvementRate: number;
  topCompanies: string[];
  strongestSkills: string[];
  improvementAreas: string[];
}

interface InterviewDataContextType {
  interviews: Interview[];
  stats: InterviewStats;
  loading: boolean;
  error: string | null;
  addInterview: (interview: Omit<Interview, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const InterviewDataContext = createContext<InterviewDataContextType | undefined>(undefined);

export function InterviewDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState<InterviewStats>({
    totalInterviews: 0,
    averageScore: 0,
    totalTime: 0,
    thisWeekInterviews: 0,
    improvementRate: 0,
    topCompanies: [],
    strongestSkills: [],
    improvementAreas: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchInterviews();
    } else {
      setInterviews([]);
      setStats({
        totalInterviews: 0,
        averageScore: 0,
        totalTime: 0,
        thisWeekInterviews: 0,
        improvementRate: 0,
        topCompanies: [],
        strongestSkills: [],
        improvementAreas: [],
      });
      setLoading(false);
    }
  }, [user]);

  const fetchInterviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setInterviews(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (interviewData: Interview[]) => {
    if (interviewData.length === 0) {
      setStats({
        totalInterviews: 0,
        averageScore: 0,
        totalTime: 0,
        thisWeekInterviews: 0,
        improvementRate: 0,
        topCompanies: [],
        strongestSkills: [],
        improvementAreas: [],
      });
      return;
    }

    const completedInterviews = interviewData.filter(i => i.status === 'completed');
    const totalInterviews = completedInterviews.length;
    
    // Calculate average score
    const scoresWithValues = completedInterviews.filter(i => i.score !== undefined && i.score !== null);
    const averageScore = scoresWithValues.length > 0 
      ? Math.round(scoresWithValues.reduce((sum, i) => sum + (i.score || 0), 0) / scoresWithValues.length)
      : 0;

    // Calculate total time
    const totalTime = completedInterviews.reduce((sum, i) => sum + i.duration, 0);

    // Calculate this week's interviews
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekInterviews = completedInterviews.filter(
      i => new Date(i.created_at) >= oneWeekAgo
    ).length;

    // Calculate improvement rate (comparing last 5 vs previous 5)
    let improvementRate = 0;
    if (scoresWithValues.length >= 10) {
      const recent5 = scoresWithValues.slice(0, 5);
      const previous5 = scoresWithValues.slice(5, 10);
      
      const recentAvg = recent5.reduce((sum, i) => sum + (i.score || 0), 0) / 5;
      const previousAvg = previous5.reduce((sum, i) => sum + (i.score || 0), 0) / 5;
      
      improvementRate = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
    }

    // Get top companies
    const companyCount = completedInterviews.reduce((acc, i) => {
      acc[i.company] = (acc[i.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCompanies = Object.entries(companyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([company]) => company);

    // Analyze strongest skills and improvement areas
    const typeScores = completedInterviews.reduce((acc, i) => {
      if (i.score !== undefined && i.score !== null) {
        if (!acc[i.type]) acc[i.type] = [];
        acc[i.type].push(i.score);
      }
      return acc;
    }, {} as Record<string, number[]>);

    const typeAverages = Object.entries(typeScores).map(([type, scores]) => ({
      type,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    }));

    const strongestSkills = typeAverages
      .sort((a, b) => b.average - a.average)
      .slice(0, 2)
      .map(item => item.type);

    const improvementAreas = typeAverages
      .sort((a, b) => a.average - b.average)
      .slice(0, 2)
      .map(item => item.type);

    setStats({
      totalInterviews,
      averageScore,
      totalTime: Math.round(totalTime / 60), // Convert to hours
      thisWeekInterviews,
      improvementRate,
      topCompanies,
      strongestSkills,
      improvementAreas,
    });
  };

  const addInterview = async (interviewData: Omit<Interview, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([
          {
            ...interviewData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setInterviews(prev => [data, ...prev]);
      calculateStats([data, ...interviews]);
    } catch (err) {
      console.error('Error adding interview:', err);
      throw new Error('Failed to save interview');
    }
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInterviews(prev => 
        prev.map(interview => 
          interview.id === id ? { ...interview, ...data } : interview
        )
      );
      
      const updatedInterviews = interviews.map(interview => 
        interview.id === id ? { ...interview, ...data } : interview
      );
      calculateStats(updatedInterviews);
    } catch (err) {
      console.error('Error updating interview:', err);
      throw new Error('Failed to update interview');
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedInterviews = interviews.filter(interview => interview.id !== id);
      setInterviews(updatedInterviews);
      calculateStats(updatedInterviews);
    } catch (err) {
      console.error('Error deleting interview:', err);
      throw new Error('Failed to delete interview');
    }
  };

  const refreshData = async () => {
    await fetchInterviews();
  };

  return (
    <InterviewDataContext.Provider value={{
      interviews,
      stats,
      loading,
      error,
      addInterview,
      updateInterview,
      deleteInterview,
      refreshData,
    }}>
      {children}
    </InterviewDataContext.Provider>
  );
}

export function useInterviewData() {
  const context = useContext(InterviewDataContext);
  if (context === undefined) {
    throw new Error('useInterviewData must be used within an InterviewDataProvider');
  }
  return context;
}