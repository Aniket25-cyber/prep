import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { InterviewForm } from '../components/interview/InterviewForm';
import { InterviewSetup as InterviewSetupType } from '../types';

interface InterviewSetupProps {
  onNavigate: (page: string) => void;
  onStartInterview: (data: InterviewSetupType) => void;
  onBack: () => void;
}

export function InterviewSetup({ onNavigate, onStartInterview, onBack }: InterviewSetupProps) {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header onNavigate={onNavigate} />
      
      <main className="py-8">
        <InterviewForm 
          onSubmit={onStartInterview}
          onBack={onBack}
        />
      </main>

      <Footer />
    </motion.div>
  );
}