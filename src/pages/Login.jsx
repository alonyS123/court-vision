import { supabase } from '../supabase'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setMessage(error.message)
        } else {
            navigate('/dashboard')
        }
    }

    async function handleSignUp() {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email to confirm your account!')
        }
    }

    useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) navigate('/dashboard')
    })
}, [])

async function handleResetPassword() {
    if (!email) {
        setMessage('Enter your email first')
        return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
        setMessage(error.message)
    } else {
        setMessage('Password reset link sent to your email!')
    }
}

async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard`
        }
    })
    if (error) setMessage(error.message)
}

    return (
        <div className="min-h-screen bg-black text-white flex flex-col"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <div className="flex-1 flex items-center justify-center">
            <div className="w-80" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}>
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2 text-center">Court Vision</p>
                <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-500 focus:outline-none mb-3"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-orange-500 focus:outline-none mb-4"
                />

                {message && <p className="text-orange-400 text-sm mb-4 text-center">{message}</p>}

                <button 
                    onClick={handleResetPassword}
                    className="text-orange-500 text-sm hover:text-orange-400 transition-all text-right w-full mb-4"
                >
                    Forgot Password?
                </button>

                <button 
                    onClick={handleLogin}
                    className="w-full p-3 rounded-lg font-bold text-sm tracking-wide mb-3"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                    LOG IN
                </button>
                <button 
                    onClick={handleSignUp}
                    className="w-full p-3 rounded-lg font-bold text-sm tracking-wide bg-gray-800 border border-gray-700"
                >
                    SIGN UP
                </button>
                <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-600 text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-800" />
            </div>

            <button
                onClick={handleGoogleLogin}
                className="w-full p-3 rounded-lg font-bold text-sm tracking-wide bg-white text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
            </div>
            </div>
            <Footer />
        </div>
    )
}