import { useState, useEffect, useRef, useCallback } from 'react'
import { LiveKitService, LiveKitConfig } from '../lib/livekit'
import { TavusService, CreateConversationRequest } from '../lib/tavus'
import { RemoteParticipant, RemoteTrack, RemoteTrackPublication } from 'livekit-client'
import { InterviewSetup } from '../types'

interface InterviewState {
  isConnected: boolean
  isRecording: boolean
  isVideoEnabled: boolean
  agentConnected: boolean
  sessionDuration: number
  error: string | null
  avatarUrl: string | null
  conversationId: string | null
}

interface ConversationMessage {
  speaker: 'user' | 'agent'
  content: string
  timestamp: number
}

export function useInterview() {
  const [state, setState] = useState<InterviewState>({
    isConnected: false,
    isRecording: false,
    isVideoEnabled: true,
    agentConnected: false,
    sessionDuration: 0,
    error: null,
    avatarUrl: null,
    conversationId: null,
  })

  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([])
  
  const livekitService = useRef<LiveKitService>(new LiveKitService())
  const tavusService = useRef<TavusService>(new TavusService())
  const sessionTimer = useRef<NodeJS.Timeout | null>(null)
  const startTime = useRef<number>(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = useCallback(async () => {
    if (sessionTimer.current) {
      clearInterval(sessionTimer.current)
      sessionTimer.current = null
    }

    try {
      await livekitService.current.disconnect()
      
      if (state.conversationId) {
        await tavusService.current.endConversation(state.conversationId)
      }
    } catch (error) {
      console.warn('Error during cleanup:', error)
    }
  }, [state.conversationId])

  const startInterview = useCallback(async (interviewData: InterviewSetup, userId: string) => {
    try {
      setState(prev => ({ ...prev, error: null }))

      // Generate unique room name
      const roomName = `interview-${userId}-${Date.now()}`
      const participantName = `user-${userId}`

      // Set up LiveKit event handlers
      livekitService.current.setEventHandlers({
        onParticipantConnected: (participant: RemoteParticipant) => {
          console.log('Interview agent connected:', participant.identity)
          setState(prev => ({ ...prev, agentConnected: true }))
          
          // Only create Tavus conversation after LiveKit connection is established
          createTavusConversation(interviewData)
        },
        onTrackSubscribed: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
          console.log('Agent track subscribed:', track.kind)
          // Handle agent audio/video tracks if needed
        },
        onDisconnected: () => {
          console.log('Disconnected from interview room')
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            agentConnected: false,
            isRecording: false 
          }))
        },
      })

      // Connect to LiveKit room
      // Ensure livekitService is initialized
      if (!livekitService.current) {
        console.warn('LiveKit service was null, reinitializing...')
        livekitService.current = new LiveKitService()
      }

      const livekitConfig: LiveKitConfig = {
        room: roomName,
        identity: participantName,
        interviewData: {
          position: interviewData.position,
          company: interviewData.company,
          type: interviewData.type,
          difficulty: interviewData.difficulty,
          jobDescription: interviewData.jobDescription,
          resume: interviewData.resume,
        },
      }

      await livekitService.current.connectToRoom(livekitConfig)

      // Enable microphone by default
      await livekitService.current.enableMicrophone()

      setState(prev => ({
        ...prev,
        isConnected: true,
        isRecording: true,
      }))

      // Start session timer
      startTime.current = Date.now()
      sessionTimer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
        setState(prev => ({ ...prev, sessionDuration: elapsed }))
      }, 1000)

      // Simulate agent connection after a short delay if no real agent connects
      setTimeout(() => {
        setState(prev => {
          if (!prev.agentConnected) {
            console.log('Simulating agent connection for demo purposes')
            createTavusConversation(interviewData)
            return { ...prev, agentConnected: true }
          }
          return prev
        })
      }, 3000)

    } catch (error) {
      console.error('Error starting interview:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start interview' 
      }))
    }
  }, [])

  const createTavusConversation = useCallback(async (interviewData: InterviewSetup) => {
    try {
      // End any active conversations first to avoid concurrent conversation limits
      await tavusService.current.endAllActiveConversations()
      
      // Add delay to allow Tavus API to process conversation terminations
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const replicaId = tavusService.current.getAvatarForInterviewType(interviewData.type)
      
      const conversationRequest: CreateConversationRequest = {
        replica_id: replicaId,
        conversation_name: `Interview: ${interviewData.position} at ${interviewData.company}`,
        custom_greeting: `Hello! I'm excited to interview you for the ${interviewData.position} position at ${interviewData.company}. This will be a ${interviewData.type.toLowerCase()} interview. Are you ready to begin?`,
      }

      const tavusConversation = await tavusService.current.createConversation(conversationRequest)

      setState(prev => ({
        ...prev,
        avatarUrl: tavusConversation.conversation_url,
        conversationId: tavusConversation.conversation_id,
      }))
    } catch (error) {
      console.error('Error creating Tavus conversation:', error)
      // Don't fail the entire interview if Tavus fails
      setState(prev => ({ 
        ...prev, 
        error: 'Avatar connection failed, but interview can continue' 
      }))
    }
  }, [])
  const toggleRecording = useCallback(async () => {
    try {
      if (state.isRecording) {
        await livekitService.current.disableMicrophone()
      } else {
        await livekitService.current.enableMicrophone()
      }
      
      setState(prev => ({ ...prev, isRecording: !prev.isRecording }))
    } catch (error) {
      console.error('Error toggling recording:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to toggle microphone' 
      }))
    }
  }, [state.isRecording])

  const toggleVideo = useCallback(async () => {
    try {
      if (state.isVideoEnabled) {
        await livekitService.current.disableCamera()
      } else {
        await livekitService.current.enableCamera()
      }
      
      setState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))
    } catch (error) {
      console.error('Error toggling video:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to toggle camera' 
      }))
    }
  }, [state.isVideoEnabled])

  const endInterview = useCallback(async (): Promise<{ summary: string; transcript: string | null }> => {
    try {
      // Stop the session timer
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current)
        sessionTimer.current = null
      }

      let summary = ''
      let transcript: string | null = null

      // Get conversation summary and transcript from Tavus
      if (state.conversationId) {
        try {
          summary = await tavusService.current.generateInterviewSummary(
            state.conversationId,
            {
              position: '',
              company: '',
              type: '',
              duration: state.sessionDuration,
            },
            state.sessionDuration
          )
          
          transcript = await tavusService.current.getConversationTranscript(state.conversationId)
        } catch (error) {
          console.warn('Could not get Tavus summary/transcript:', error)
        }
      }

      // Cleanup connections
      await cleanup()

      setState(prev => ({
        ...prev,
        isConnected: false,
        agentConnected: false,
        isRecording: false,
        avatarUrl: null,
        conversationId: null,
      }))

      return { summary, transcript }
    } catch (error) {
      console.error('Error ending interview:', error)
      throw error
    }
  }, [state.conversationId, state.sessionDuration, cleanup])

  const generateInterviewSummary = useCallback(async (interviewData: InterviewSetup): Promise<string> => {
    if (state.conversationId) {
      try {
        return await tavusService.current.generateInterviewSummary(
          state.conversationId,
          interviewData,
          state.sessionDuration
        )
      } catch (error) {
        console.warn('Could not generate Tavus summary:', error)
      }
    }

    // Fallback summary
    const conversationLength = Math.floor(state.sessionDuration / 60)
    return `Completed a ${conversationLength} minute ${interviewData.type.toLowerCase()} interview for the ${interviewData.position} position at ${interviewData.company}. The AI interviewer provided realistic questions and scenarios that helped practice for the actual interview process. This mock interview session enhanced interview skills through realistic questioning and provided valuable preparation experience.`
  }, [state.conversationId, state.sessionDuration])

  return {
    state,
    conversationMessages,
    startInterview,
    toggleRecording,
    toggleVideo,
    endInterview,
    generateInterviewSummary,
  }
}