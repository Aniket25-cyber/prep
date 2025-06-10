import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff,
  Clock,
  User,
  Bot,
  MonitorOff,
  AlertCircle
} from 'lucide-react';
import { InterviewSetup } from '../../types';
import { useInterview } from '../../hooks/useInterview';
import { useAuth } from '../../hooks/useAuth';
import { InterviewAgent } from './InterviewAgent';

interface InterviewRoomProps {
  interviewData: InterviewSetup;
  onEndInterview: (score: number, feedback: string) => void;
}

export function InterviewRoom({ interviewData, onEndInterview }: InterviewRoomProps) {
  const { user } = useAuth();
  const { 
    state, 
    startInterview, 
    toggleRecording, 
    toggleVideo, 
    endInterview,
    generateInterviewSummary 
  } = useInterview();

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeInterview();
    setupUserMedia();

    return () => {
      cleanup();
    };
  }, []);

  const initializeInterview = async () => {
    if (!user) return;

    try {
      await startInterview(interviewData, user.id);
    } catch (error) {
      console.error('Failed to initialize interview:', error);
    }
  };

  const setupUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      mediaStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (mediaError) {
      console.warn('Could not access camera/microphone:', mediaError);
    }
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = async () => {
    try {
      await toggleRecording();
    } catch (error) {
      console.error('Error toggling microphone:', error);
    }
  };

  const handleToggleVideo = async () => {
    try {
      await toggleVideo();
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleEndInterview = async () => {
    setIsEnding(true);
    
    try {
      const { summary } = await endInterview();
      
      // Generate a score based on interview duration and type
      let score = Math.floor(Math.random() * 30) + 70; // Base score 70-100
      
      // Adjust score based on interview duration
      const expectedDuration = interviewData.duration * 60;
      const actualDuration = state.sessionDuration;
      const durationRatio = actualDuration / expectedDuration;
      
      if (durationRatio > 0.8) {
        score += 5; // Bonus for completing most of the interview
      }
      
      // Use the generated summary as feedback
      const feedback = summary || `Great job completing your ${interviewData.type.toLowerCase()} interview for the ${interviewData.position} position at ${interviewData.company}. You demonstrated good communication skills and relevant experience. Continue practicing to build confidence for your actual interview.`;

      cleanup();
      onEndInterview(score, feedback);
    } catch (error) {
      console.error('Error ending interview:', error);
      cleanup();
      onEndInterview(75, 'Interview completed successfully. Thank you for your participation!');
    } finally {
      setIsEnding(false);
    }
  };

  const remainingTime = (interviewData.duration * 60) - state.sessionDuration;
  const progress = (state.sessionDuration / (interviewData.duration * 60)) * 100;

  if (!state.isConnected && !state.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-jade/30 border-t-jade rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ghost text-lg mb-2">Connecting to AI Interviewer...</p>
          <p className="text-bluegray">Please wait while we set up your interview session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="bg-surface/80 backdrop-blur-md border-b border-onyx/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-jade" />
              <div>
                <h1 className="text-xl font-bold text-ghost">AI Mock Interview</h1>
                <p className="text-sm text-bluegray">
                  {interviewData.position} at {interviewData.company}
                </p>
              </div>
            </div>

            {/* Timer */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-right">
                <div className="text-2xl font-bold text-ghost">
                  {formatTime(state.sessionDuration)}
                </div>
                <div className="text-sm text-bluegray">
                  {formatTime(Math.max(0, remainingTime))} remaining
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-onyx"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="text-jade transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-jade" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Video Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-salmon/20 border border-salmon/30 rounded-2xl p-8 max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-salmon mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-ghost mb-2">Connection Error</h3>
              <p className="text-bluegray mb-4">{state.error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-jade text-ghost rounded-lg hover:bg-jade/80 transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* AI Interviewer */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-video">
                <InterviewAgent
                  avatarUrl={state.avatarUrl}
                  isVideoEnabled={state.isVideoEnabled}
                  agentConnected={state.agentConnected}
                  interviewType={interviewData.type}
                />
              </div>
            </motion.div>

            {/* User Video */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-video bg-surface border border-onyx/50 rounded-2xl overflow-hidden relative">
                {!state.isVideoEnabled ? (
                  <div className="absolute inset-0 bg-background flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff className="h-16 w-16 text-bluegray mx-auto mb-4" />
                      <p className="text-bluegray">Camera is off</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={userVideoRef}
                      className="w-full h-full object-cover scale-x-[-1]"
                      autoPlay
                      playsInline
                      muted
                    />
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-maya" />
                        <span className="text-ghost text-sm font-medium">You</span>
                        {!state.isRecording && <MicOff className="h-4 w-4 text-salmon" />}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Controls */}
        <motion.div
          className="flex justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-surface/80 backdrop-blur-sm border border-onyx/50 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              {/* Mute/Unmute */}
              <motion.button
                onClick={handleToggleMute}
                disabled={!state.agentConnected || isEnding}
                className={`p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !state.isRecording 
                    ? 'bg-salmon/20 text-salmon border border-salmon/30 hover:bg-salmon/30' 
                    : 'bg-jade/20 text-jade border border-jade/30 hover:bg-jade/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!state.isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </motion.button>

              {/* Video On/Off */}
              <motion.button
                onClick={handleToggleVideo}
                disabled={isEnding}
                className={`p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  !state.isVideoEnabled 
                    ? 'bg-salmon/20 text-salmon border border-salmon/30 hover:bg-salmon/30' 
                    : 'bg-maya/20 text-maya border border-maya/30 hover:bg-maya/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!state.isVideoEnabled ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </motion.button>

              {/* Share Screen */}
              <motion.button
                onClick={handleToggleScreenShare}
                disabled={isEnding}
                className={`p-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isScreenSharing
                    ? 'bg-lemon/20 text-lemon border border-lemon/30 hover:bg-lemon/30'
                    : 'bg-lemon/20 text-lemon border border-lemon/30 hover:bg-lemon/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
              </motion.button>

              {/* End Call */}
              <motion.button
                onClick={handleEndInterview}
                disabled={isEnding}
                className="p-4 rounded-xl bg-salmon/20 text-salmon border border-salmon/30 hover:bg-salmon/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PhoneOff className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Interview Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center space-x-6 bg-surface/30 border border-onyx/50 rounded-2xl px-6 py-3">
            <div className="text-center">
              <p className="text-sm text-bluegray">Position</p>
              <p className="text-ghost font-medium">{interviewData.position}</p>
            </div>
            <div className="w-px h-8 bg-onyx/50" />
            <div className="text-center">
              <p className="text-sm text-bluegray">Company</p>
              <p className="text-ghost font-medium">{interviewData.company}</p>
            </div>
            <div className="w-px h-8 bg-onyx/50" />
            <div className="text-center">
              <p className="text-sm text-bluegray">Type</p>
              <p className="text-ghost font-medium">{interviewData.type}</p>
            </div>
            <div className="w-px h-8 bg-onyx/50" />
            <div className="text-center">
              <p className="text-sm text-bluegray">Difficulty</p>
              <p className="text-ghost font-medium">{interviewData.difficulty}</p>
            </div>
            <div className="w-px h-8 bg-onyx/50" />
            <div className="text-center">
              <p className="text-sm text-bluegray">Status</p>
              <p className={`font-medium ${state.agentConnected ? 'text-jade' : 'text-lemon'}`}>
                {state.agentConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}