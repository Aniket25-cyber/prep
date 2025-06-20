import { createClient } from 'npm:@supabase/supabase-js@2'
import { AccessToken } from 'npm:livekit-server-sdk@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface TokenRequest {
  roomName: string
  participantName: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { roomName, participantName }: TokenRequest = await req.json()

    if (!roomName || !participantName) {
      return new Response(
        JSON.stringify({ error: 'Missing roomName or participantName' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get LiveKit credentials from environment
    const livekitApiKey = Deno.env.get('LIVEKIT_API_KEY')
    const livekitApiSecret = Deno.env.get('LIVEKIT_API_SECRET')
    const livekitWsUrl = Deno.env.get('LIVEKIT_WS_URL')

    if (!livekitApiKey || !livekitApiSecret || !livekitWsUrl) {
      return new Response(
        JSON.stringify({ error: 'LiveKit credentials not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate LiveKit access token
    const token = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: participantName,
      ttl: '2h',
    })

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const jwt = await token.toJwt()

    console.log(`Generated token for room: ${roomName}, participant: ${participantName}`)

    return new Response(
      JSON.stringify({ 
        token: jwt,
        wsUrl: livekitWsUrl 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating LiveKit token:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})