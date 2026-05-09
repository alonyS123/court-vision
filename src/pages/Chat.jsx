import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ReactMarkdown from 'react-markdown'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionContext, setSessionContext] = useState(null)
    const navigate = useNavigate()

    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    useEffect(() => {
    async function loadSessionContext() {

    const { data: recentSessions } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
        
    const { data: recentShots } = await supabase
    .from('shots')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15)

        // Get all sessions for zone breakdown stats
        const { data: allSessions } = await supabase
            .from('sessions')
            .select('zone, makes, total_shots')

        // Aggregate zone stats
        const zoneStats = {}
        allSessions?.forEach(s => {
            if (!zoneStats[s.zone]) {
                zoneStats[s.zone] = { makes: 0, total: 0 }
            }
            zoneStats[s.zone].makes += s.makes
            zoneStats[s.zone].total += s.total_shots
        })

        // Format zone stats with percentages
        const zoneBreakdown = Object.entries(zoneStats).map(([zone, stats]) => ({
            zone,
            makes: stats.makes,
            total: stats.total,
            percentage: Math.round((stats.makes / stats.total) * 100)
        }))

        setSessionContext({
            recentSessions,
            zoneBreakdown,
            recentShots
        })
    }
    loadSessionContext()
}, [])

useEffect(() => {
    async function loadChatHistory() {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content')
            .order('created_at', { ascending: true })
            .limit(50)

        if (error) {
            console.log('error loading chat history:', error.message)
            return
        }

        if (data && data.length > 0) {
            setMessages(data)
        }
    }
    loadChatHistory()
}, [])

    async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Save user message to Supabase
const { data: { user } } = await supabase.auth.getUser()
await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'user',
    content: input
})

    try {
        const { data: { session } } = await supabase.auth.getSession()
        const response = await fetch(import.meta.env.VITE_SUPABASE_FUNCTIONS_URL + '/claude-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                messages: newMessages,
                sessionContext: sessionContext || {}
            })
        })

        const data = await response.json()
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I had trouble responding.'
        setMessages([...newMessages, { role: 'assistant', content: aiText }])
        // Save AI response to Supabase
await supabase.from('chat_messages').insert({
    user_id: user.id,
    role: 'assistant',
    content: aiText
})
    } catch (error) {
        console.log('chat error:', error)
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }])
    }

    setLoading(false)
}

    return (
        <div className="min-h-screen bg-black text-white flex flex-col"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* Header */}
            <div className="border-b border-gray-900 px-4 py-4 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-400 hover:text-white text-sm"
                >
                    ← Back
                </button>
                <div className="text-center">
                    <p className="text-orange-500 text-xs font-bold tracking-widest uppercase">Court Vision</p>
                    <h1 className="text-lg font-bold">AI Coach</h1>
                </div>
                <div className="w-12" />
            </div>

            {/* Messages */}
<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl w-full mx-auto">
    {messages.length === 0 && (
        <div className="text-center mt-20">
            <p className="text-4xl mb-4">🏀</p>
            <h2 className="text-xl font-bold">Hey, I'm your AI Coach</h2>
            <p className="text-gray-500 mt-2 text-sm px-8">
                Ask me about your shooting form, get drill recommendations, or anything basketball-related.
            </p>
        </div>
    )}
    {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-br-sm' 
                    : 'bg-gray-900 border border-gray-800 text-gray-100 rounded-bl-sm'
            }`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
        </div>
    ))}
    {loading && (
        <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    )}
   <div ref={messagesEndRef} /> 
</div>

            {/* Input */}
            <div className="border-t border-gray-900 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask your coach..."
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="px-6 py-3 rounded-lg font-bold text-sm tracking-wide disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                    >
                        {loading ? '...' : 'SEND'}
                    </button>
                </div>
            </div>
        </div>
    )
}