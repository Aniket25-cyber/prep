import React from 'react'
import { VideoOff, Loader, Bot } from 'lucide-react'

interface InterviewAgentProps {
  avatarUrl?: string | null
  isVideoEnabled: boolean
  agentConnected: boolean
  interviewType: string
}

export function InterviewAgent({ 
  avatarUrl, 
  isVideoEnabled, 
  agentConnected, 
  interviewType 
}: InterviewAgentProps) {
  if (!isVideoEnabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface/50 rounded-xl border border-onyx/50">
        <div className="text-center text-bluegray">
          <VideoOff className="h-16 w-16 mx-auto mb-4" />
          <p>Video disabled</p>
        </div>
      </div>
    )
  }

  if (!agentConnected || !avatarUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface/50 rounded-xl border border-onyx/50">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-jade/20 to-maya/20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-jade/30">
            {agentConnected ? (
              <Bot className="h-16 w-16 text-jade" />
            ) : (
              <Loader className="h-8 w-8 text-jade animate-spin" />
            )}
          </div>
          <p className="text-ghost font-medium">
            {agentConnected ? 'AI Interviewer Ready' : 'Preparing AI Interviewer...'}
          </p>
          <p className="text-sm text-bluegray mt-2">
            {agentConnected 
              ? `Ready for your ${interviewType.toLowerCase()} interview`
              : 'Setting up your personalized interview experience'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-surface/50 rounded-xl border border-onyx/50 overflow-hidden">
      <iframe
        src={avatarUrl}
        className="w-full h-full border-0"
        allow="camera; microphone; autoplay; encrypted-media; fullscreen"
        title="AI Interview Agent"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
}