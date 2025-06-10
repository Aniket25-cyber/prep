import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Building, Calendar, ChevronRight, BarChart3 } from 'lucide-react';
import { Interview } from '../../types';
import { useInterviewData } from '../../hooks/useInterviewData';

interface InterviewHistoryProps {
  onViewInterview: (interview: Interview) => void;
}

export function InterviewHistory({ onViewInterview }: InterviewHistoryProps) {
  const { interviews, loading } = useInterviewData();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-jade';
    if (score >= 70) return 'text-lemon';
    return 'text-salmon';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-jade/20 border-jade/30';
    if (score >= 70) return 'bg-lemon/20 border-lemon/30';
    return 'bg-salmon/20 border-salmon/30';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-jade/20 text-jade border-jade/30';
      case 'Medium': return 'bg-lemon/20 text-lemon border-lemon/30';
      case 'Hard': return 'bg-salmon/20 text-salmon border-salmon/30';
      default: return 'bg-bluegray/20 text-bluegray border-bluegray/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-maya/20 text-maya border-maya/30';
      case 'Behavioral': return 'bg-jade/20 text-jade border-jade/30';
      case 'System Design': return 'bg-lemon/20 text-lemon border-lemon/30';
      case 'HR': return 'bg-salmon/20 text-salmon border-salmon/30';
      default: return 'bg-bluegray/20 text-bluegray border-bluegray/30';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-ghost mb-2">
            Interview History
          </h2>
          <p className="text-bluegray">
            Review your past interviews and track your progress
          </p>
        </div>
        
        <motion.div
          className="flex items-center space-x-2 bg-jade/20 border border-jade/30 rounded-full px-4 py-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <BarChart3 className="h-4 w-4 text-jade" />
          <span className="text-jade text-sm font-medium">{interviews.length} Completed</span>
        </motion.div>
      </div>

      {loading ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-jade/30 border-t-jade rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bluegray">Loading interview history...</p>
        </motion.div>
      ) : (
        interviews.length === 0 ? (
          <motion.div
            className="text-center py-12 bg-surface/30 border border-onyx/50 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-jade/20 rounded-full mb-4">
              <Clock className="h-8 w-8 text-jade" />
            </div>
            <h3 className="text-xl font-semibold text-ghost mb-2">No interviews yet</h3>
            <p className="text-bluegray">Start your first mock interview to see your history here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                className="bg-surface/50 backdrop-blur-sm border border-onyx/50 rounded-2xl p-6 hover:border-jade/30 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onViewInterview(interview)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-semibold text-ghost group-hover:text-jade transition-colors">
                        {interview.position}
                      </h3>
                      
                      {interview.score && (
                        <div className={`flex items-center space-x-2 px-3 py-1 border rounded-full ${getScoreBg(interview.score)}`}>
                          <Award className="h-4 w-4" />
                          <span className={`font-semibold ${getScoreColor(interview.score)}`}>
                            {interview.score}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-bluegray">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{interview.company}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-bluegray" />
                        <span className="text-sm text-bluegray">{interview.duration} min</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-bluegray" />
                        <span className="text-sm text-bluegray">
                          {new Date(interview.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 border rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
                          {interview.difficulty}
                        </div>
                        <div className={`px-2 py-1 border rounded-full text-xs font-medium ${getTypeColor(interview.type)}`}>
                          {interview.type}
                        </div>
                      </div>
                    </div>

                    {interview.feedback && (
                      <p className="text-sm text-bluegray line-clamp-2 group-hover:text-ghost/80 transition-colors">
                        {interview.feedback}
                      </p>
                    )}
                  </div>

                  <motion.div
                    className="ml-6 text-bluegray group-hover:text-jade transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
    </motion.section>
  );
}