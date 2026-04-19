import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
            </div>

            {/* Nav */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-5xl mx-auto">
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
            <div className="relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-20">
                <div className="max-w-2xl">
                    <div className="inline-block px-3 py-1 rounded-full border border-gray-800 text-xs text-orange-500 font-bold tracking-wide uppercase mb-6">
                        AI-Powered Basketball Analytics
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                        Track every shot.
                        <br />
                        <span style={{ color: '#f97316' }}>Improve every session.</span>
                    </h1>
                    <p className="text-gray-400 text-lg mt-6 leading-relaxed max-w-lg">
                        Film yourself shooting, and Court Vision automatically counts your makes, 
                        misses, and tracks your progress over time. No manual counting. No spreadsheets.
                    </p>
                    <div className="flex gap-4 mt-10">
                        <button
                            className="px-8 py-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200"
                            style={{ 
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 4px 30px rgba(249, 115, 22, 0.3)'
                            }}
                            onClick={() => navigate('/login')}
                        >
                            START FOR FREE →
                        </button>
                        <button
                            className="px-8 py-4 rounded-lg font-bold text-sm tracking-wide border border-gray-700 text-gray-300 hover:border-gray-500 transition-all"
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        >
                            HOW IT WORKS
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative z-10 border-y border-gray-800">
                <div className="max-w-5xl mx-auto px-8 py-8 flex justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">AI</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Ball Detection</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">Auto</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Shot Tracking</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">Real-time</p>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">Progress Charts</p>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-8 py-20">
                <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">How It Works</p>
                <h2 className="text-3xl font-bold tracking-tight">Three steps to better shooting</h2>
                
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 relative overflow-hidden group hover:border-gray-700 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-all"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                            style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
                            <span className="text-orange-500 font-bold">1</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Film Your Shots</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Prop up your phone and record yourself shooting. Any court, any time. Works with regular phone video.
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 relative overflow-hidden group hover:border-gray-700 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-all"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                            style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
                            <span className="text-orange-500 font-bold">2</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">AI Analyzes</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Our AI detects the basketball and hoop in every frame, tracking each shot attempt and whether it went in.
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 relative overflow-hidden group hover:border-gray-700 transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-all"
                            style={{ background: 'radial-gradient(circle at top right, #f97316, transparent)' }} />
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                            style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
                            <span className="text-orange-500 font-bold">3</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Track Progress</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            See your shooting percentage, zone breakdown, and improvement over weeks and months on your personal dashboard.
                        </p>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
                <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Features</p>
                <h2 className="text-3xl font-bold tracking-tight">Everything you need to improve</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Automatic Shot Detection</h3>
                            <p className="text-gray-500 text-sm">AI identifies every shot attempt — no manual tagging needed.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Make/Miss Classification</h3>
                            <p className="text-gray-500 text-sm">Know exactly which shots went in and which ones missed.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Zone Tracking</h3>
                            <p className="text-gray-500 text-sm">Track performance from different court positions over time.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Progress Dashboard</h3>
                            <p className="text-gray-500 text-sm">Charts and stats that show your improvement week over week.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Session History</h3>
                            <p className="text-gray-500 text-sm">Every practice session saved and searchable by date or zone.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold mb-1">Works With Any Phone</h3>
                            <p className="text-gray-500 text-sm">No special equipment needed. Just your phone camera.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="relative z-10 max-w-5xl mx-auto px-8 py-20 text-center">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{ background: 'radial-gradient(circle at center, #f97316 0%, transparent 60%)' }} />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight">Ready to level up your game?</h2>
                        <p className="text-gray-400 mt-3 max-w-md mx-auto">
                            Start tracking your shooting today. It's free to get started.
                        </p>
                        <button
                            className="mt-8 px-10 py-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200"
                            style={{ 
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 4px 30px rgba(249, 115, 22, 0.3)'
                            }}
                            onClick={() => navigate('/login')}
                        >
                            GET STARTED FREE →
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 py-8 px-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                        </div>
                        <span className="font-bold text-sm">Court Vision</span>
                    </div>
                    <p className="text-gray-600 text-xs">© 2026 Court Vision. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}