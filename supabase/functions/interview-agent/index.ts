import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AgentRequest {
  room: string
  interviewData: {
    position: string
    company: string
    type: string
    difficulty: string
    jobDescription: string
    resume: string
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { room, interviewData }: AgentRequest = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Construct the complete agent prompt for interview
    const systemPrompt = generateInterviewPrompt(interviewData)

    // In a real implementation, you would:
    // 1. Connect to LiveKit room as an agent
    // 2. Initialize the AI agent with the system prompt
    // 3. Set up STT (Speech-to-Text) pipeline
    // 4. Configure LLM with the system prompt
    // 5. Set up TTS (Text-to-Speech) pipeline
    // 6. Handle real-time audio streaming
    // 7. Integrate with Tavus for avatar display

    const agentConfig = {
      room,
      interviewData,
      systemPrompt,
      voiceSettings: {
        voice: getVoiceForInterviewType(interviewData.type),
        speed: 1.0,
        pitch: 1.0,
      },
      llmSettings: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 200, // Keep responses concise for voice
      },
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Interview agent configured successfully',
        config: agentConfig 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error configuring interview agent:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateInterviewPrompt(interviewData: any): string {
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
- Start with a warm greeting and introduction
- Ask follow-up questions to dive deeper into responses
- Provide encouragement and positive reinforcement when appropriate

CONVERSATION FLOW:
1. Start with a warm greeting and brief introduction
2. Ask the candidate to introduce themselves
3. Proceed with relevant interview questions based on the type and difficulty
4. Ask follow-up questions to clarify or expand on responses
5. Conclude with asking if the candidate has any questions
6. End with next steps and thank them for their time

Remember: This is a practice interview to help the candidate improve. Be realistic but constructive in your approach. Maintain the persona of a professional interviewer throughout the session.`
}

function getVoiceForInterviewType(interviewType: string): string {
  const voiceMap: Record<string, string> = {
    'Technical': 'professional-tech-interviewer',
    'Behavioral': 'warm-hr-professional',
    'System Design': 'senior-architect-voice',
    'HR': 'friendly-hr-representative',
  }

  return voiceMap[interviewType] || 'professional-neutral'
}