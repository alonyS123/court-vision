import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {

    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [timeFilter, setTimeFilter] = useState('all')
    const [showAllSessions, setShowAllSessions] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchSessions() {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.log('error:', error.message)
            } else {
                setSessions(data)
            }
            setLoading(false)
        }
        fetchSessions()
    }, [])

    function getFilteredSessions() {
    const now = new Date()
    return sessions.filter(s => {
        if (timeFilter === 'all') return true
        const sessionDate = new Date(s.created_at)
        const diff = now - sessionDate
        const days = diff / (1000 * 60 * 60 * 24)
        if (timeFilter === 'week') return days <= 7
        if (timeFilter === 'month') return days <= 30
        if (timeFilter === 'year') return days <= 365
        return true
    })
}

async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
}

   const filtered = getFilteredSessions()
const totalMakes = filtered.reduce((sum, s) => sum + s.makes, 0)
const totalShots = filtered.reduce((sum, s) => sum + s.total_shots, 0)
const overallPercentage = totalShots > 0 ? Math.round(totalMakes / totalShots * 100) : 0

   
const chartData = filtered.map((s, i) => ({
    name: 'Session ' + (filtered.length - i),
    date: new Date(s.created_at).toLocaleDateString(),
    percentage: Number(s.shooting_percentage),
    zone: s.zone
})).reverse()

async function deleteSession(id) {
    await supabase.from('shots').delete().eq('session_id', id)
    await supabase.from('sessions').delete().eq('id', id)
    setSessions(sessions.filter(s => s.id !== id))
}

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto">
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase">Court Vision</p>
                
                <div className="flex justify-between items-center mt-2">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm text-gray-400 bg-gray-800 border border-gray-700 hover:text-white transition-all"
                >
                    Log Out
                </button>
            </div>


        {sessions.length === 0 && !loading && (
    <div className="mt-16 text-center">
        <p className="text-4xl mb-4">🏀</p>
        <h2 className="text-xl font-bold">No sessions yet</h2>
        <p className="text-gray-500 mt-2 text-sm">Film yourself shooting and upload your first video to get started.</p>
        <button
            className="mt-6 px-8 py-3 rounded-lg font-bold text-sm tracking-wide"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            onClick={() => navigate('/upload')}
        >
            START YOUR FIRST SESSION →
        </button>
    </div>
)}
                {sessions.length > 0 && (
                <>

                        <div className="flex gap-2 mt-4">
            {['week', 'month', 'year', 'all'].map((period) => (
                <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                        timeFilter === period 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}
                >
                    {period === 'all' ? 'All Time' : period}
                </button>
            ))}
        </div>
                
                <div className="flex gap-8 mt-8">
                    <div className="bg-gray-800 p-6 rounded-lg flex-1 text-center">
                        <p className="text-3xl font-bold">{totalShots}</p>
                        <p className="text-gray-400 text-sm mt-1">Total Shots</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg flex-1 text-center">
                        <p className="text-3xl font-bold text-green-500">{overallPercentage}%</p>
                        <p className="text-gray-400 text-sm mt-1">Overall</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg flex-1 text-center">
                        <p className="text-3xl font-bold">{filtered.length}</p>
                        <p className="text-gray-400 text-sm mt-1">Sessions</p>
                    </div>
                </div>

               {filtered.length > 1 && (
                <div className="mt-10">
                    <p className="text-gray-600 text-xs font-bold tracking-widest uppercase mb-4">Progress Over Time</p>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#1f2937" />
                                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#1f2937" />
                                <Tooltip 
                                    contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                                    labelStyle={{ color: '#9ca3af' }}
                                    itemStyle={{ color: '#f97316' }}
                                />
                                <Line type="monotone" dataKey="percentage" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )} 

                            <div className="mt-10">
                    <p className="text-gray-600 text-xs font-bold tracking-widest uppercase mb-4">Zone Breakdown</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['Left Close', 'Center Close', 'Right Close',
                        'Left Mid', 'Center Mid', 'Right Mid',
                        'Left Far', 'Center Far', 'Right Far'].map((zoneName) => {
                            const zoneSessions = filtered.filter(s => s.zone === zoneName)
                            const zoneMakes = zoneSessions.reduce((sum, s) => sum + s.makes, 0)
                            const zoneTotal = zoneSessions.reduce((sum, s) => sum + s.total_shots, 0)
                            const zonePct = zoneTotal > 0 ? Math.round(zoneMakes / zoneTotal * 100) : null
                            return (
                                <div key={zoneName} className={`p-3 rounded-lg text-center border ${
                                    zonePct !== null ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-gray-800'
                                }`}>
                                    <p className="text-gray-500 text-xs">{zoneName}</p>
                                    {zonePct !== null ? (
                                        <>
                                            <p className="text-lg font-bold mt-1">{zoneMakes}/{zoneTotal}</p>
                                            <p className={`text-sm font-bold ${zonePct >= 50 ? 'text-green-500' : 'text-red-500'}`}>{zonePct}%</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-700 text-xs mt-2">No data</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                
                        <h2 className="text-xl font-bold mt-10">Session History</h2>
{loading && <p className="text-gray-400 mt-4">Loading...</p>}
{(showAllSessions ? filtered : filtered.slice(0, 5)).map((session) => (
    <div key={session.id} className="bg-gray-800 p-4 rounded-lg mt-3 flex justify-between items-center">
        <div>
            <p className="font-bold">{session.zone}</p>
            <p className="text-gray-400 text-sm">
                {new Date(session.created_at).toLocaleDateString()}
            </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="font-bold">{session.makes}/{session.total_shots}</p>
                <p className={session.shooting_percentage >= 50 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                    {session.shooting_percentage}%
                </p>
            </div>
            <button 
                onClick={() => deleteSession(session.id)}
                className="text-gray-600 hover:text-red-500 transition-all text-sm"
            >
                ✕
            </button>
        </div>
    </div>
))}
{filtered.length > 5 && !showAllSessions && (
    <button 
        onClick={() => setShowAllSessions(true)}
        className="mt-4 w-full py-3 rounded-lg text-sm font-bold text-gray-400 bg-gray-800 border border-gray-700 hover:text-white transition-all"
    >
        Show All ({filtered.length} sessions)
    </button>
)}
{showAllSessions && filtered.length > 5 && (
    <button 
        onClick={() => setShowAllSessions(false)}
        className="mt-4 w-full py-3 rounded-lg text-sm font-bold text-gray-400 bg-gray-800 border border-gray-700 hover:text-white transition-all"
    >
        Show Less
    </button>
)}

                <button
                    className="mt-8 px-6 py-3 rounded-lg font-bold w-full"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                    onClick={() => navigate('/upload')}
                >
                    New Session
                </button>
                </>
)}
            </div>
        </div>
    )
}