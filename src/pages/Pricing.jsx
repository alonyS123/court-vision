import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Pricing() {
    const [annual, setAnnual] = useState(true)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black text-white flex flex-col"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Background atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 60%)' }} />
            </div>

            {/* Nav */}
            <nav className="relative z-10 flex justify-between items-center px-6 md:px-8 py-6 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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

            {/* Main content */}
            <div className="relative z-10 flex-1 max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-20 w-full">

                {/* Headline */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
                        Train smarter. Shoot better.
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                        AI-powered shot analysis built for players who are serious about improvement.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    <button
                        onClick={() => setAnnual(false)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                            !annual ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setAnnual(true)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            annual ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Annual
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                                background: annual ? 'rgba(255,255,255,0.2)' : 'rgba(249,115,22,0.15)',
                                color: annual ? 'white' : '#f97316'
                            }}>
                            Save 32%
                        </span>
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Free */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
                        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-3">Free</p>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="text-5xl font-bold">0₪</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-8">Try Court Vision risk-free</p>
                        <ul className="space-y-3 mb-10">
                            {[
                                '2 video analyses per month',
                                'Videos up to 30 seconds',
                                'Basic shot metrics (arc, accuracy)',
                                '7-day history',
                                'Court Vision watermark',
                            ].map((f) => (
                                <li key={f} className="flex items-start gap-3 text-sm text-gray-400">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-auto w-full py-3 rounded-lg font-bold text-sm tracking-wide border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white transition-all"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Pro */}
                    <div className="relative bg-gray-900 border border-orange-500 rounded-2xl p-8 flex flex-col"
                        style={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.15)' }}>
                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
                            style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                            POPULAR
                        </div>
                        <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-3">Pro</p>
                        <div className="mb-1">
                            {annual ? (
                                <>
                                    <div className="flex items-end gap-1">
                                        <span className="text-5xl font-bold">399₪</span>
                                        <span className="text-gray-400 text-sm mb-2">/year</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">~33₪/month, billed annually</p>
                                </>
                            ) : (
                                <div className="flex items-end gap-1">
                                    <span className="text-5xl font-bold">49₪</span>
                                    <span className="text-gray-400 text-sm mb-2">/month</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-8">For players serious about getting better</p>
                        <ul className="space-y-3 mb-10">
                            {[
                                'Unlimited video analyses',
                                'Videos up to 5 minutes',
                                'Full arc + form metrics',
                                'AI Coach chat',
                                'Full history + progress tracking',
                                'No watermark',
                            ].map((f) => (
                                <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => console.log('Start Pro clicked - Lemon Squeezy not configured yet')}
                            className="mt-auto w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                            }}
                        >
                            Start Pro
                        </button>
                    </div>
                </div>

                {/* Value anchor */}
                <p className="text-center text-gray-600 text-sm mt-10">
                    Less than ⅙ of a single private training session — every month.
                </p>
            </div>

            <Footer />
        </div>
    )
}