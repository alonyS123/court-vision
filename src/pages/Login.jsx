import { supabase } from '../supabase'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


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

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            <div className="w-80">
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
            </div>
        </div>
    )
}