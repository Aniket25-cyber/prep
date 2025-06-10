import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components/common/Footer';
import { InterviewRoom as InterviewRoomComponent } from '../components/interview/InterviewRoom';
import { FeedbackWidget } from '../components/interview/FeedbackWidget';
import { useInterviewData } from '../hooks/useInterviewData';
import { InterviewSetup } from '../types';

interface InterviewRoomProps {
  interviewData: InterviewSetup;
  onNavigate: (page: string) => void;
}

export function InterviewRoom({ interviewData, onNavigate }: InterviewRoomProps) {
  const { addInterview } = useInterviewData();
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleEndInterview = async (finalScore: number, finalFeedback: string) => {
    setScore(finalScore);
    setFeedback(finalFeedback);
    setShowFeedback(true);

    // Save interview to database
    try {
      await addInterview({
        position: interviewData.position,
        company: interviewData.company,
        difficulty: interviewData.difficulty,
        type: interviewData.type,
        duration: interviewData.duration,
        score: finalScore,
        feedback: finalFeedback,
        status: 'completed',
      });
    } catch (error) {
      console.error('Failed to save interview:', error);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    onNavigate('dashboard');
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <InterviewRoomComponent 
        interviewData={interviewData}
        onEndInterview={handleEndInterview}
      />
      
      <Footer />

      <FeedbackWidget
        isOpen={showFeedback}
        onClose={handleCloseFeedback}
        score={score}
        feedback={feedback}
        interviewData={{
          position: interviewData.position,
          company: interviewData.company,
          type: interviewData.type,
          duration: interviewData.duration,
        }}
      />
    </motion.div>
  );
}