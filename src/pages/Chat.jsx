import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ReactMarkdown from 'react-markdown'
import { useSubscription } from '../context/SubscriptionContext'

const FREE_MESSAGE_LIMIT = 3

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionContext, setSessionContext] = useState(null)
    const navigate = useNavigate()
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [loadingHistory, setLoadingHistory] = useState(true)
    const [sessionMessageCount, setSessionMessageCount] = useState(0)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    const { subscriptionStatus } = useSubscription()
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
        } else if (data && data.length > 0) {
            setMessages(data)
        }
        setLoadingHistory(false)
    }
    loadChatHistory()
}, [])

    async function sendMessage() {
    if (!input.trim() || loading) return

    if (subscriptionStatus === 'free' && sessionMessageCount >= FREE_MESSAGE_LIMIT) {
        setShowUpgradeModal(true)
        return
    }

    const isLastFreeMessage = subscriptionStatus === 'free' && sessionMessageCount === FREE_MESSAGE_LIMIT - 1

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
        setSessionMessageCount(prev => prev + 1)
        if (isLastFreeMessage) setShowUpgradeModal(true)
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
                <button
                onClick={() => setShowClearConfirm(true)}
                className="text-gray-400 hover:text-red-500 text-sm transition-all"
            >
                Clear
            </button>
            </div>

            {/* Messages */}
<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl w-full mx-auto">
    {loadingHistory && (
        <div className="text-center mt-20">
            <div className="inline-block w-6 h-6 border-2 border-gray-700 border-t-orange-500 rounded-full animate-spin" />
        </div>
    )}
    {!loadingHistory && messages.length === 0 && (
    <div className="text-center mt-20 px-4">
        <p className="text-4xl mb-4">🏀</p>
        <h2 className="text-xl font-bold">Hey, I'm your AI Coach</h2>
        
        {sessionContext && sessionContext.recentSessions?.length > 0 ? (
            <>
                <p className="text-gray-500 mt-2 text-sm">
                    I've reviewed your recent sessions. Try asking:
                </p>
                <div className="mt-6 space-y-2 max-w-sm mx-auto">
                    {[
                        "How am I shooting overall?",
                        "What should I work on?",
                        "Compare my form on makes vs misses",
                        "Give me a drill for my weak zone"
                    ].map((suggestion) => (
                        <button
                    key={suggestion}
                    onClick={() => {
                        setInput(suggestion)
                        setTimeout(() => sendMessage(), 0)
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-orange-500 transition-all text-sm text-gray-300"
                >
                    {suggestion}
                </button>
                    ))}
                </div>
            </>
        ) : (
            <>
                <p className="text-gray-500 mt-2 text-sm">
                    Upload a shooting video first so I can give you personalized feedback.
                </p>
                <button
                    onClick={() => navigate('/upload')}
                    className="mt-6 px-8 py-3 rounded-lg font-bold text-sm tracking-wide"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                    UPLOAD YOUR FIRST VIDEO
                </button>
            </>
        )}
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
                {subscriptionStatus === 'free' && sessionMessageCount >= FREE_MESSAGE_LIMIT && (
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full mb-3 py-2 rounded-lg text-xs font-bold text-center transition-all"
                        style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.2)' }}
                    >
                        Upgrade to Pro for unlimited coaching →
                    </button>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={subscriptionStatus === 'free' && sessionMessageCount >= FREE_MESSAGE_LIMIT ? 'Upgrade to Pro for unlimited chat' : 'Ask your coach...'}
                        disabled={subscriptionStatus === 'free' && sessionMessageCount >= FREE_MESSAGE_LIMIT}
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading || (subscriptionStatus === 'free' && sessionMessageCount >= FREE_MESSAGE_LIMIT)}
                        className="px-6 py-3 rounded-lg font-bold text-sm tracking-wide disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                    >
                        {loading ? '...' : 'SEND'}
                    </button>
                </div>
            </div>
            {showClearConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Clear Chat History?</h2>
            <p className="text-gray-400 text-sm mb-6">
                This will delete all your conversations with the AI Coach. This cannot be undone.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-sm bg-gray-800 border border-gray-700 hover:border-gray-600"
                >
                    Cancel
                </button>
                <button
                    onClick={async () => {
                        const { data: { user } } = await supabase.auth.getUser()
                        await supabase.from('chat_messages').delete().eq('user_id', user.id)
                        setMessages([])
                        setShowClearConfirm(false)
                    }}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-sm bg-red-600 hover:bg-red-700"
                >
                    Clear
                </button>
            </div>
        </div>
    </div>
)}
        {showUpgradeModal && (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Unlock unlimited coaching</h2>
            <p className="text-gray-400 text-sm mb-6">
                AI coaching chat is a Pro feature. Upgrade to unlock unlimited feedback from your AI coach.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-sm bg-gray-800 border border-gray-700 hover:border-gray-600"
                >
                    Maybe Later
                </button>
                <button
                    onClick={() => navigate('/pricing')}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                    Upgrade →
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    )
}