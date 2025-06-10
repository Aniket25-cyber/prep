import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client'
import { supabase } from './supabase'

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-url'

export interface LiveKitConfig {
  room: string
  identity: string
  interviewData: {
    position: string
    company: string
    type: string
    difficulty: string
    jobDescription: string
    resume: string
  }
}

export class LiveKitService {
  private room: Room | null = null
  private onParticipantConnected?: (participant: RemoteParticipant) => void
  private onTrackSubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => void
  private onDisconnected?: () => void

  async generateToken(roomName: string, participantName: string): Promise<string> {
    try {
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error('User not authenticated')
      }

      // Call the Supabase Edge Function to generate the token securely
      const { data, error } = await supabase.functions.invoke('livekit-token', {
        body: {
          roomName: roomName,
          participantName: participantName,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      return data.token
    } catch (error) {
      console.error('Error generating LiveKit token:', error)
      throw error
    }
  }

  async connectToRoom(config: LiveKitConfig): Promise<Room> {
    try {
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
          },
          facingMode: 'user',
        },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Set up event listeners
      this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('Participant connected:', participant.identity)
        this.onParticipantConnected?.(participant)
      })

      this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        console.log('Track subscribed:', track.kind)
        this.onTrackSubscribed?.(track, publication, participant)
      })

      this.room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room')
        this.onDisconnected?.()
      })

      // Generate token and connect
      const token = await this.generateToken(config.room, config.identity)
      await this.room.connect(LIVEKIT_URL, token)

      // Send agent configuration for interview
      await this.configureInterviewAgent(config)

      return this.room
    } catch (error) {
      console.error('Error connecting to LiveKit room:', error)
      throw error
    }
  }

  private async configureInterviewAgent(config: LiveKitConfig) {
    if (!this.room) return

    // Send configuration to the AI interview agent
    const agentConfig = {
      type: 'interview_agent_config',
      interviewData: config.interviewData,
      instructions: this.generateInterviewInstructions(config.interviewData),
    }

    // Send via data channel to the agent
    await this.room.localParticipant.publishData(
      JSON.stringify(agentConfig),
      { reliable: true }
    )
  }

  private generateInterviewInstructions(interviewData: any): string {
    const baseInstructions = `You are an experienced interviewer conducting a ${interviewData.type.toLowerCase()} interview for the ${interviewData.position} position at ${interviewData.company}.`
    
    const typeSpecificInstructions = {
      'Technical': `Focus on technical skills, problem-solving abilities, and coding knowledge. Ask about algorithms, system design, and technical challenges. Be thorough but fair in your assessment.`,
      'Behavioral': `Focus on past experiences, leadership skills, teamwork, and cultural fit. Use the STAR method to evaluate responses. Ask about challenges, conflicts, and achievements.`,
      'System Design': `Focus on architectural thinking, scalability, and system trade-offs. Ask about designing large-scale systems, database choices, and performance considerations.`,
      'HR': `Focus on cultural fit, motivation, career goals, and company alignment. Ask about work style, values, and long-term aspirations.`
    }

    const difficultyInstructions = {
      'Easy': 'Keep questions straightforward and foundational. Be encouraging and supportive.',
      'Medium': 'Ask moderately challenging questions that test both knowledge and application.',
      'Hard': 'Ask complex, challenging questions that test deep understanding and advanced skills.'
    }

    return `${baseInstructions}

INTERVIEW TYPE: ${interviewData.type}
${typeSpecificInstructions[interviewData.type] || ''}

DIFFICULTY LEVEL: ${interviewData.difficulty}
${difficultyInstructions[interviewData.difficulty] || ''}

CANDIDATE BACKGROUND:
${interviewData.resume}

JOB REQUIREMENTS:
${interviewData.jobDescription}

INTERVIEW GUIDELINES:
- Conduct a professional, realistic interview experience
- Ask relevant questions based on the job description and candidate's background
- Provide constructive feedback and follow-up questions
- Maintain a professional but friendly demeanor
- Keep responses conversational and engaging (2-3 sentences typically)
- Take notes on the candidate's responses for final evaluation
- End the interview naturally when appropriate or when time is up

Remember: This is a practice interview to help the candidate improve. Be realistic but constructive in your approach.`
  }

  async enableMicrophone(): Promise<void> {
    if (!this.room) throw new Error('Not connected to room')

    try {
      await this.room.localParticipant.setMicrophoneEnabled(true)
    } catch (error) {
      console.error('Error enabling microphone:', error)
      throw error
    }
  }

  async disableMicrophone(): Promise<void> {
    if (!this.room) throw new Error('Not connected to room')

    try {
      await this.room.localParticipant.setMicrophoneEnabled(false)
    } catch (error) {
      console.error('Error disabling microphone:', error)
      throw error
    }
  }

  async enableCamera(): Promise<void> {
    if (!this.room) throw new Error('Not connected to room')

    try {
      await this.room.localParticipant.setCameraEnabled(true)
    } catch (error) {
      console.error('Error enabling camera:', error)
      throw error
    }
  }

  async disableCamera(): Promise<void> {
    if (!this.room) throw new Error('Not connected to room')

    try {
      await this.room.localParticipant.setCameraEnabled(false)
    } catch (error) {
      console.error('Error disabling camera:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.room) {
      await this.room.disconnect()
      this.room = null
    }
  }

  setEventHandlers(handlers: {
    onParticipantConnected?: (participant: RemoteParticipant) => void
    onTrackSubscribed?: (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => void
    onDisconnected?: () => void
  }) {
    this.onParticipantConnected = handlers.onParticipantConnected
    this.onTrackSubscribed = handlers.onTrackSubscribed
    this.onDisconnected = handlers.onDisconnected
  }

  getRoom(): Room | null {
    return this.room
  }

  isMicrophoneEnabled(): boolean {
    return this.room?.localParticipant.isMicrophoneEnabled ?? false
  }

  isCameraEnabled(): boolean {
    return this.room?.localParticipant.isCameraEnabled ?? false
  }
}