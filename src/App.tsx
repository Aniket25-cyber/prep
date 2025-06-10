import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewRoom } from './pages/InterviewRoom';
import { InterviewDataProvider } from './hooks/useInterviewData';
import { InterviewSetup as InterviewSetupType } from './types';

type Page = 'landing' | 'dashboard' | 'interview-setup' | 'interview-room';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [interviewData, setInterviewData] = useState<InterviewSetupType | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      // Auth modal will be triggered by header
    }
  };

  const handleStartInterview = () => {
    setCurrentPage('interview-setup');
  };

  const handleInterviewSetup = (data: InterviewSetupType) => {
    setInterviewData(data);
    setCurrentPage('interview-room');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jade/30 border-t-jade rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ghost">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if user is logged in and on landing page
  if (user && currentPage === 'landing') {
    setCurrentPage('dashboard');
  }

  // Redirect to landing if user is not logged in and trying to access protected pages
  if (!user && (currentPage === 'dashboard' || currentPage === 'interview-setup' || currentPage === 'interview-room')) {
    setCurrentPage('landing');
  }

  switch (currentPage) {
    case 'dashboard':
      return (
        <Dashboard 
          onNavigate={handleNavigate}
          onStartInterview={handleStartInterview}
        />
      );
    case 'interview-setup':
      return (
        <InterviewSetup
          onNavigate={handleNavigate}
          onStartInterview={handleInterviewSetup}
          onBack={handleBackToDashboard}
        />
      );
    case 'interview-room':
      return interviewData ? (
        <InterviewRoom
          interviewData={interviewData}
          onNavigate={handleNavigate}
        />
      ) : (
        <Dashboard 
          onNavigate={handleNavigate}
          onStartInterview={handleStartInterview}
        />
      );
    default:
      return (
        <Landing 
          onNavigate={handleNavigate}
          onGetStarted={handleGetStarted}
        />
      );
  }
}

function App() {
  return (
    <AuthProvider>
      <InterviewDataProvider>
        <AppContent />
      </InterviewDataProvider>
    </AuthProvider>
  );
}

export default App;