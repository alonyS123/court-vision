import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { supabase } from '../supabase'

const CHECKOUT_MONTHLY = 'https://courtvisionapp.lemonsqueezy.com/checkout/buy/3f9f787e-d0c2-44a8-b926-dff992f3a8ae'
const CHECKOUT_ANNUAL  = 'https://courtvisionapp.lemonsqueezy.com/checkout/buy/de81fbab-3b32-433e-93e4-7bca367acba9'

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-gray-800 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-900 transition-all"
            >
                <span className="font-bold text-sm md:text-base pr-4">{q}</span>
                <span className="text-orange-500 flex-shrink-0 text-lg leading-none">
                    {open ? '−' : '+'}
                </span>
            </button>
            {open && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                    {a}
                </div>
            )}
        </div>
    )
}

export default function Pricing() {
    const [annual, setAnnual] = useState(true)
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const navigate = useNavigate()

    async function handleStartPro() {
        setCheckoutLoading(true)
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
            if (error && error.name !== 'AuthSessionMissingError') {
                console.error('Unexpected auth error:', error)
            }
            navigate('/login')
            return
        }
        const base = annual ? CHECKOUT_ANNUAL : CHECKOUT_MONTHLY
        const url = `${base}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${encodeURIComponent(user.id)}`
        window.location.href = url
    }

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

                {/* Hook line */}
                <p className="text-center text-xl md:text-2xl font-bold text-white mb-10 -mt-4">
                    Less than one shawarma a month.{' '}
                    <span style={{ color: '#f97316' }}>Train like a pro every day.</span>
                </p>

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
                            onClick={handleStartPro}
                            disabled={checkoutLoading}
                            className="mt-auto w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                            }}
                        >
                            {checkoutLoading ? 'Loading...' : 'Start Pro'}
                        </button>
                    </div>
                </div>

                {/* Value anchor */}
                <p className="text-center text-gray-600 text-sm mt-10">
                    For the price of one private training session, get a year of unlimited AI coaching.
                </p>

                {/* FAQ */}
                <div className="mt-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-2 max-w-2xl mx-auto">
                        {[
                            {
                                q: 'Can I cancel anytime?',
                                a: 'Yes. Cancel from your account settings anytime. You keep access until the end of your billing period — no penalties, no fees.'
                            },
                            {
                                q: 'What counts as a "video analysis"?',
                                a: 'Each video you upload for analysis counts as one. Free users get 2 per month. Pro users get unlimited analyses.'
                            },
                            {
                                q: 'Do I need any special equipment to film my shots?',
                                a: 'No. Any phone camera works. Film from the side at chest height, make sure the ball and hoop are both visible.'
                            },
                            {
                                q: 'What does the AI Coach actually do?',
                                a: 'The AI Coach reviews your shot data — release angle, form, accuracy — and gives you specific, personalized feedback. It\'s available 24/7 in chat. Think of it as a shooting coach in your pocket.'
                            },
                            {
                                q: 'Is my data private?',
                                a: 'Yes. Your videos and shot data are only accessible by you. We don\'t share, sell, or train on your data. See our Privacy Policy for details.'
                            },
                            {
                                q: 'Do you offer refunds?',
                                a: 'Yes — annual subscriptions come with a 7-day money-back guarantee. Monthly subscriptions can be canceled anytime to stop future charges.'
                            },
                        ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}