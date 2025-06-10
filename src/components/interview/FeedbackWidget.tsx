import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, MessageCircle, TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { Button } from '../common/Button';

interface FeedbackWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  feedback: string;
  interviewData?: {
    position: string;
    company: string;
    type: string;
    duration: number;
  };
}

export function FeedbackWidget({ 
  isOpen, 
  onClose, 
  score, 
  feedback, 
  interviewData 
}: FeedbackWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-jade';
    if (score >= 70) return 'text-lemon';
    return 'text-salmon';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return 'from-jade to-maya';
    if (score >= 70) return 'from-lemon to-maya';
    return 'from-salmon to-lemon';
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-surface border border-onyx/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-jade/20 to-maya/20 border-b border-onyx/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-jade/20 rounded-xl">
                    <Award className="h-6 w-6 text-jade" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ghost">Interview Feedback</h2>
                    {interviewData && (
                      <p className="text-bluegray">
                        {interviewData.position} at {interviewData.company}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-bluegray hover:text-ghost hover:bg-surface/50 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Score Section */}
                <div className="lg:col-span-1">
                  <motion.div
                    className="bg-background/50 border border-onyx/50 rounded-2xl p-6 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-ghost mb-6 flex items-center justify-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-jade" />
                      <span>Interview Score</span>
                    </h3>

                    {/* Circular Progress */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-onyx"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className={`${getScoreColor(score)} transition-all duration-1000`}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            className={`text-3xl font-bold ${getScoreColor(score)}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring' }}
                          >
                            {score}%
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getScoreGradient(score)} bg-clip-text text-transparent font-semibold text-lg mb-4`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Award className={`h-5 w-5 ${getScoreColor(score)}`} />
                      <span>{getPerformanceLevel(score)}</span>
                    </motion.div>

                    {/* Score Breakdown */}
                    <div className="space-y-3">
                      {[
                        { label: 'Technical Skills', score: score + Math.floor(Math.random() * 10) - 5 },
                        { label: 'Communication', score: score + Math.floor(Math.random() * 10) - 5 },
                        { label: 'Problem Solving', score: score + Math.floor(Math.random() * 10) - 5 },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="text-left"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1 }}
                        >
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-bluegray">{item.label}</span>
                            <span className={getScoreColor(Math.min(item.score, 100))}>
                              {Math.min(item.score, 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-onyx/50 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(Math.min(item.score, 100))}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(item.score, 100)}%` }}
                              transition={{ delay: 1.6 + index * 0.1, duration: 0.8 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Stats */}
                  {interviewData && (
                    <motion.div
                      className="mt-6 grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[
                        { icon: Clock, label: 'Duration', value: `${interviewData.duration} min`, color: 'text-maya' },
                        { icon: Target, label: 'Type', value: interviewData.type, color: 'text-jade' },
                      ].map((stat, index) => (
                        <div key={index} className="bg-background/50 border border-onyx/50 rounded-xl p-4 text-center">
                          <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
                          <div className="text-xs text-bluegray mb-1">{stat.label}</div>
                          <div className="text-sm font-medium text-ghost">{stat.value}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Feedback Section */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="bg-background/50 border border-onyx/50 rounded-2xl p-6 h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-ghost mb-6 flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-maya" />
                      <span>Detailed Feedback</span>
                    </h3>

                    <motion.div
                      className="prose prose-invert max-w-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="text-bluegray leading-relaxed space-y-4">
                        <p>{feedback}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          <div className="bg-jade/10 border border-jade/30 rounded-xl p-4">
                            <h4 className="text-jade font-semibold mb-3 flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>Strengths</span>
                            </h4>
                            <ul className="space-y-2 text-sm text-bluegray">
                              <li>• Clear communication style</li>
                              <li>• Strong technical knowledge</li>
                              <li>• Good problem-solving approach</li>
                              <li>• Professional demeanor</li>
                            </ul>
                          </div>

                          <div className="bg-lemon/10 border border-lemon/30 rounded-xl p-4">
                            <h4 className="text-lemon font-semibold mb-3 flex items-center space-x-2">
                              <Zap className="h-4 w-4" />
                              <span>Areas for Improvement</span>
                            </h4>
                            <ul className="space-y-2 text-sm text-bluegray">
                              <li>• Provide more specific examples</li>
                              <li>• Ask clarifying questions</li>
                              <li>• Elaborate on past experiences</li>
                              <li>• Show more enthusiasm</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-onyx/50 p-6">
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={onClose}
                  variant="secondary"
                >
                  Close
                </Button>
                <Button>
                  Start New Interview
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}