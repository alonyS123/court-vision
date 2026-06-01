import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Background atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
                <div className="absolute top-1/3 left-0 w-72 h-72 rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
            </div>

            {/* Nav */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-8 py-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Court Vision</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 rounded-lg text-sm font-bold border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white transition-all"
                >
                    Log In
                </button>
            </nav>

            {/* Hero */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-20">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 text-xs text-orange-500 font-bold tracking-wider uppercase mb-6"
                        style={{ background: 'rgba(249, 115, 22, 0.06)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        Your Personal AI Shooting Coach
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                        Get coached on
                        <br />
                        every shot you take.
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mt-6 leading-relaxed max-w-2xl">
                        Court Vision analyzes your shooting form, arc, and accuracy from a phone video —
                        then gives you personalized coaching feedback like a real trainer would.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-10">
                        <button
                            className="px-8 py-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 4px 30px rgba(249, 115, 22, 0.4)'
                            }}
                            onClick={() => navigate('/login')}
                        >
                            START FOR FREE →
                        </button>
                        <button
                            className="px-8 py-4 rounded-lg font-bold text-sm tracking-wide border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white transition-all"
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        >
                            SEE HOW IT WORKS
                        </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-6">No credit card required. Free to get started.</p>
                </div>
            </div>

            {/* Trust strip */}
            <div className="relative z-10 border-y border-gray-900">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: '#f97316' }}>AI</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Form Analysis</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: '#f97316' }}>Auto</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Shot Detection</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: '#f97316' }}>Real-time</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Coaching Chat</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold" style={{ color: '#f97316' }}>Mobile</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">No Equipment</p>
                    </div>
                </div>
            </div>

            {/* What you get — feature showcase */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-20">
                <div className="max-w-2xl mb-16">
                    <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">What You Get</p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                        It's like having a coach
                        <br />
                        in your pocket.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Big feature - Arc Analysis */}
                    <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-10 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-96 h-96 opacity-10"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent 60%)' }} />
                        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-block px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4"
                                    style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                    Trajectory Science
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-3">Shot Arc Analysis</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    We track the basketball through every frame to calculate your release angle,
                                    peak height, and entry angle. Compare your arc to NBA-ideal mechanics
                                    — and see exactly where to improve.
                                </p>
                            </div>
                            <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Sample Shot</span>
                                    <span className="text-green-500 text-xs font-bold">Made</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">Release Angle</span>
                                        <span className="font-bold">52°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">Entry Angle</span>
                                        <span className="font-bold text-green-500">48°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 text-sm">Peak Height</span>
                                        <span className="font-bold">11.2 ft</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Analysis */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-5"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="relative z-10">
                            <div className="inline-block px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4"
                                style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                Body Mechanics
                            </div>
                            <h3 className="text-xl font-bold mb-3">Form Breakdown</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                Pose detection tracks your body through the shooting motion —
                                set-point elbow, release angle, and knee bend.
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                                    <span className="text-gray-500">Set-point Elbow</span>
                                    <span className="font-bold text-green-500">79°</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                                    <span className="text-gray-500">Release</span>
                                    <span className="font-bold text-green-500">155°</span>
                                </div>
                                <div className="flex justify-between text-sm py-2">
                                    <span className="text-gray-500">Knee Bend</span>
                                    <span className="font-bold text-green-500">122°</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Coach Chat */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-5"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="relative z-10">
                            <div className="inline-block px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4"
                                style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                Personalized
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Coaching Chat</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                Ask anything about your shooting. Get drill recommendations,
                                form feedback, and answers based on your real data.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-orange-600 text-white text-xs px-3 py-2 rounded-lg rounded-br-sm ml-8">
                                    What should I work on?
                                </div>
                                <div className="bg-black/40 border border-gray-800 text-xs px-3 py-2 rounded-lg rounded-bl-sm mr-8 text-gray-300">
                                    Your release angle is 22°—try a higher arc to create margin for error.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Tracking */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-5"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="relative z-10">
                            <div className="inline-block px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4"
                                style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                Court Map
                            </div>
                            <h3 className="text-xl font-bold mb-3">Zone Performance</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                See your shooting percentage from every spot on the court.
                                Identify your hot zones and weak spots.
                            </p>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { pct: 45, color: 'red' },
                                    { pct: 78, color: 'green' },
                                    { pct: 52, color: 'yellow' },
                                    { pct: 38, color: 'red' },
                                    { pct: 91, color: 'green' },
                                    { pct: 60, color: 'yellow' },
                                ].map((z, i) => (
                                    <div key={i}
                                        className="aspect-square rounded flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: z.color === 'green' ? 'rgba(34,197,94,0.2)' : z.color === 'red' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                                            color: z.color === 'green' ? '#22c55e' : z.color === 'red' ? '#ef4444' : '#eab308'
                                        }}>
                                        {z.pct}%
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Progress Tracking */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-5"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="relative z-10">
                            <div className="inline-block px-2 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4"
                                style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                Trends
                            </div>
                            <h3 className="text-xl font-bold mb-3">Progress Over Time</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                Watch your shooting percentage climb week over week.
                                Every session is logged, charted, and searchable.
                            </p>
                            <svg viewBox="0 0 200 60" className="w-full">
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 45 L 40 38 L 80 30 L 120 25 L 160 18 L 200 10 L 200 60 L 0 60 Z"
                                    fill="url(#grad)" />
                                <path d="M 0 45 L 40 38 L 80 30 L 120 25 L 160 18 L 200 10"
                                    stroke="#f97316" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-20">
                <div className="max-w-2xl mb-16">
                    <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">How It Works</p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                        From phone video
                        <br />
                        to coaching in seconds.
                    </h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {[
                        {
                            num: '01',
                            title: 'Film yourself shooting',
                            desc: 'Prop your phone up and shoot. Any court, any time. No special angle or equipment required — your phone camera is enough.'
                        },
                        {
                            num: '02',
                            title: 'AI analyzes the video',
                            desc: 'Our system tracks the ball through every frame, detects each shot attempt, classifies makes vs misses, and analyzes your arc + body mechanics.'
                        },
                        {
                            num: '03',
                            title: 'Get coached',
                            desc: 'See your full shot breakdown, then chat with the AI Coach about your form, drills, and what to work on. Built on your actual data.'
                        },
                    ].map((step, i) => (
                        <div key={i}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 grid md:grid-cols-[100px_1fr] gap-6 items-start hover:border-orange-500/30 transition-all">
                            <div className="text-5xl md:text-6xl font-bold tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                {step.num}
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Built for serious shooters */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-20">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 -translate-y-1/4 translate-x-1/4"
                        style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 60%)' }} />
                    <div className="relative z-10 max-w-3xl">
                        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-4">Built For</p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
                            Serious shooters who want to actually get better.
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 mt-10">
                            {[
                                { who: 'Players', desc: 'Track real progress instead of guessing if you\'re improving.' },
                                { who: 'Coaches', desc: 'Give athletes data-driven feedback they can actually act on.' },
                                { who: 'Trainers', desc: 'Show clients measurable improvement session by session.' },
                                { who: 'Parents', desc: 'See exactly how your kid is progressing — no more "they look better."' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
                                        <span className="font-bold text-orange-500 text-sm">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">{item.who}</h3>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 py-20 text-center">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                    Ready to take your
                    <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>shooting seriously?</span>
                </h2>
                <p className="text-gray-400 mt-6 text-lg max-w-md mx-auto">
                    Free to start. No credit card. Just better shooting.
                </p>
                <button
                    className="mt-10 px-10 py-5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02]"
                    style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        boxShadow: '0 4px 30px rgba(249, 115, 22, 0.4)'
                    }}
                    onClick={() => navigate('/login')}
                >
                    GET STARTED FREE →
                </button>
            </div>

            {/* Footer */}
            <Footer/>
        </div>
    )
}