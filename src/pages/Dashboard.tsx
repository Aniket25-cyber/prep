import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { NewInterview } from '../components/dashboard/NewInterview';
import { InterviewHistory } from '../components/dashboard/InterviewHistory';
import { FeedbackWidget } from '../components/interview/FeedbackWidget';
import { Interview } from '../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onStartInterview: () => void;
}

export function Dashboard({ onNavigate, onStartInterview }: DashboardProps) {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  return (
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Header currentPage="dashboard" onNavigate={onNavigate} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-ghost mb-4">
                Welcome back to{' '}
                <span className="bg-gradient-to-r from-jade to-maya bg-clip-text text-transparent">
                  Prepify
                </span>
              </h1>
              <p className="text-lg text-bluegray max-w-2xl">
                Ready to take your interview skills to the next level? Start a new practice session or review your progress.
              </p>
            </div>
          </motion.div>

          {/* New Interview Section */}
          <NewInterview onStartInterview={onStartInterview} />

          {/* Interview History Section */}
          <InterviewHistory onViewInterview={handleViewInterview} />
        </main>

        <Footer />

        {/* Feedback Widget */}
        {selectedInterview && (
          <FeedbackWidget
            isOpen={!!selectedInterview}
            onClose={() => setSelectedInterview(null)}
            score={selectedInterview.score || 0}
            feedback={selectedInterview.feedback || ''}
            interviewData={{
              position: selectedInterview.position,
              company: selectedInterview.company,
              type: selectedInterview.type,
              duration: selectedInterview.duration,
            }}
          />
        )}
      </motion.div>
  );
}