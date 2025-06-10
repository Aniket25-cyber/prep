const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY || ''
const TAVUS_API_BASE = 'https://tavusapi.com'

export interface TavusAvatar {
  avatar_id: string
  avatar_name: string
  avatar_url?: string
}

export interface TavusConversation {
  conversation_id: string
  conversation_url: string
  status: 'active' | 'ended' | 'error'
}

export interface CreateConversationRequest {
  replica_id: string
  persona_id?: string
  callback_url?: string
  conversation_name?: string
  custom_greeting?: string
  max_call_duration?: number
}

export class TavusService {
  private apiKey: string

  constructor() {
    this.apiKey = TAVUS_API_KEY
    if (!this.apiKey) {
      console.warn('Tavus API key not found. Avatar features will be disabled.')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${TAVUS_API_BASE}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavus API error: ${response.status} - ${error}`)
    }

    // Handle responses that don't return JSON (like 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null
    }

    return response.json()
  }

  async getAvailableAvatars(): Promise<TavusAvatar[]> {
    try {
      const response = await this.makeRequest('/v2/avatars')
      return response.data || []
    } catch (error) {
      console.error('Error fetching Tavus avatars:', error)
      return []
    }
  }

  async createConversation(request: CreateConversationRequest): Promise<TavusConversation> {
    try {
      // First, try to end any existing conversations to avoid concurrent limit issues
      await this.endAllActiveConversations()
      
      // Add delay to allow Tavus API to process conversation terminations
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await this.makeRequest('/v2/conversations', {
        method: 'POST',
        body: JSON.stringify(request),
      })
      
      return {
        conversation_id: response.conversation_id,
        conversation_url: response.conversation_url,
        status: response.status || 'active',
      }
    } catch (error) {
      console.error('Error creating Tavus conversation:', error)
      throw error
    }
  }

  async getAllConversations(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/v2/conversations')
      return response.data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  async endAllActiveConversations(): Promise<void> {
    try {
      const conversations = await this.getAllConversations()
      const activeConversations = conversations.filter(conv => 
        conv.status === 'active' || conv.status === 'starting'
      )
      
      // End all active conversations
      await Promise.all(
        activeConversations.map(conv => 
          this.endConversation(conv.conversation_id).catch(err => 
            console.warn(`Failed to end conversation ${conv.conversation_id}:`, err)
          )
        )
      )
      
      if (activeConversations.length > 0) {
        console.log(`Ended ${activeConversations.length} active conversations`)
      }
    } catch (error) {
      console.warn('Error ending active conversations:', error)
    }
  }

  async endConversation(conversationId: string): Promise<void> {
    try {
      await this.makeRequest(`/v2/conversations/${conversationId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error ending Tavus conversation:', error)
      throw error
    }
  }

  async getConversationStatus(conversationId: string): Promise<TavusConversation> {
    try {
      const response = await this.makeRequest(`/v2/conversations/${conversationId}`)
      return {
        conversation_id: response.conversation_id,
        conversation_url: response.conversation_url,
        status: response.status,
      }
    } catch (error) {
      console.error('Error getting conversation status:', error)
      throw error
    }
  }

  async getConversationTranscript(conversationId: string): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/v2/conversations/${conversationId}/transcript`)
      
      if (response && response.transcript) {
        return response.transcript
      }
      
      const details = await this.makeRequest(`/v2/conversations/${conversationId}`)
      if (details && details.transcript) {
        return details.transcript
      }
      
      return null
    } catch (error) {
      console.warn('Could not fetch conversation transcript:', error)
      return null
    }
  }

  async generateInterviewSummary(conversationId: string, interviewData: any, duration: number): Promise<string> {
    try {
      const transcript = await this.getConversationTranscript(conversationId)
      
      if (transcript && transcript.length > 50) {
        return this.createSummaryFromTranscript(transcript, interviewData, duration)
      }
      
      return this.createPersonalizedSummary(interviewData, duration)
      
    } catch (error) {
      console.warn('Error generating interview summary:', error)
      return this.createPersonalizedSummary(interviewData, duration)
    }
  }

  private createSummaryFromTranscript(transcript: string, interviewData: any, duration: number): string {
    const words = transcript.toLowerCase().split(/\s+/)
    const keyTopics = this.extractKeyTopics(words, interviewData.type)
    const conversationLength = Math.floor(duration / 60)
    
    let summary = `Completed a ${conversationLength} minute ${interviewData.type.toLowerCase()} interview for the ${interviewData.position} position at ${interviewData.company}. `
    
    if (keyTopics.length > 0) {
      summary += `The discussion covered ${keyTopics.join(', ')}. `
    }
    
    summary += this.getInsightsByInterviewType(interviewData.type)
    summary += ` The AI interviewer provided realistic questions and scenarios that helped practice for the actual interview process.`
    
    return summary
  }

  private createPersonalizedSummary(interviewData: any, duration: number): string {
    const conversationLength = Math.floor(duration / 60)
    
    const openings = [
      `Completed a comprehensive ${conversationLength} minute mock interview`,
      `Practiced for ${conversationLength} minutes in a simulated interview`,
      `Engaged in a ${conversationLength} minute interview simulation`,
      `Participated in a ${conversationLength} minute practice interview session`
    ]
    
    const opening = openings[Math.floor(Math.random() * openings.length)]
    let summary = `${opening} for the ${interviewData.position} role at ${interviewData.company}. `
    
    summary += this.getInsightsByInterviewType(interviewData.type)
    
    const closings = [
      `The session provided valuable practice with realistic interview scenarios and immediate feedback.`,
      `This mock interview helped build confidence and identify areas for improvement.`,
      `The AI-powered interview simulation offered authentic practice for the real interview process.`,
      `The practice session enhanced interview skills through realistic questioning and feedback.`
    ]
    
    summary += ` ${closings[Math.floor(Math.random() * closings.length)]}`
    
    return summary
  }

  private extractKeyTopics(words: string[], interviewType: string): string[] {
    const topicKeywords: Record<string, string[]> = {
      'Technical': ['algorithm', 'coding', 'system', 'design', 'architecture', 'database', 'api'],
      'Behavioral': ['teamwork', 'leadership', 'conflict', 'challenge', 'achievement', 'communication'],
      'System Design': ['scalability', 'architecture', 'database', 'microservices', 'load', 'performance'],
      'HR': ['culture', 'values', 'motivation', 'goals', 'experience', 'background', 'fit']
    }
    
    const relevantKeywords = topicKeywords[interviewType] || []
    const foundTopics: string[] = []
    
    relevantKeywords.forEach(keyword => {
      if (words.includes(keyword) && !foundTopics.includes(keyword)) {
        foundTopics.push(keyword)
      }
    })
    
    return foundTopics.slice(0, 3)
  }

  private getInsightsByInterviewType(interviewType: string): string {
    const insights: Record<string, string[]> = {
      'Technical': [
        'The session focused on problem-solving approaches and technical communication skills.',
        'Practice included coding challenges and system design discussions.',
        'The interview covered technical concepts and implementation strategies.',
        'Discussion emphasized both technical depth and clear explanation abilities.'
      ],
      'Behavioral': [
        'The conversation explored past experiences and situational responses.',
        'Focus was on leadership examples and team collaboration scenarios.',
        'Discussion covered conflict resolution and decision-making processes.',
        'The session emphasized storytelling and the STAR method for responses.'
      ],
      'System Design': [
        'The interview covered scalability and architectural decision-making.',
        'Discussion included database design and system optimization strategies.',
        'Focus was on trade-offs and real-world system constraints.',
        'The session emphasized both high-level design and implementation details.'
      ],
      'HR': [
        'The conversation explored cultural fit and career motivations.',
        'Discussion covered company values alignment and personal goals.',
        'Focus was on communication style and professional background.',
        'The session emphasized authenticity and clear self-presentation.'
      ]
    }
    
    const typeInsights = insights[interviewType]
    if (typeInsights) {
      return typeInsights[Math.floor(Math.random() * typeInsights.length)]
    }
    
    return 'The interview provided comprehensive practice with industry-standard questions and scenarios.'
  }

  // Helper method to get avatar for interview type
  getAvatarForInterviewType(interviewType: string): string {
    const defaultReplicaId = import.meta.env.VITE_TAVUS_DEFAULT_REPLICA_ID || ''

    if (!defaultReplicaId) {
      throw new Error('Tavus replica ID not configured. Please set VITE_TAVUS_DEFAULT_REPLICA_ID in your environment variables.')
    }

    // In production, you could have different avatars for different interview types
    return defaultReplicaId
  }
}