import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { messages, sessionContext } = await req.json()

        const systemPrompt = `You are an AI basketball coach helping a player improve their shooting. 
You have access to their session data which includes shot attempts, makes, misses, shooting percentage, 
arc analysis (release angle, entry angle), and form analysis (set-point elbow angle, release elbow angle, knee bend).

Player's recent session data:
${JSON.stringify(sessionContext, null, 2)}

Be encouraging, specific, and actionable. Reference their actual numbers when giving advice. 
Keep responses concise (2-4 sentences usually). If they ask for drills, recommend specific basketball drills.`

        // Convert chat messages to Gemini's format
        const geminiContents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }))

        const apiKey = Deno.env.get('GEMINI_API_KEY') ?? ''
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: geminiContents,
            }),
        })

        const data = await response.json()
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})