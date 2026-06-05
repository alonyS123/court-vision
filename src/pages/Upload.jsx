import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { supabase } from '../supabase'
import { useSubscription } from '../context/SubscriptionContext'

const DEMO_VIDEO_URL = 'https://ermwkfaakpzliqklpuxl.supabase.co/storage/v1/object/public/demo-videos/court%20vision%20test%20video%202.0.mp4'
const FREE_UPLOAD_LIMIT = 2
const FREE_MAX_SECONDS = 30

export default function Upload() {
    const [file, setFile] = useState(null)
    const [loadingDemo, setLoadingDemo] = useState(false)
    const [durationError, setDurationError] = useState(false)
    const [uploadsThisMonth, setUploadsThisMonth] = useState(0)
    const [limitLoading, setLimitLoading] = useState(true)
    const navigate = useNavigate()
    const { subscriptionStatus } = useSubscription()

    // Gate 1: count sessions uploaded this calendar month
    useEffect(() => {
        async function checkUploadLimit() {
            if (subscriptionStatus !== 'free') {
                setLimitLoading(false)
                return
            }
            const startOfMonth = new Date()
            startOfMonth.setDate(1)
            startOfMonth.setHours(0, 0, 0, 0)

            const { count, error } = await supabase
                .from('sessions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth.toISOString())

            if (!error && count !== null) setUploadsThisMonth(count)
            setLimitLoading(false)
        }
        checkUploadLimit()
    }, [subscriptionStatus])

    // Gate 2 helper: resolve a File's duration in seconds
    function getVideoDuration(f) {
        return new Promise((resolve) => {
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src)
                resolve(video.duration)
            }
            video.onerror = () => resolve(0)
            video.src = URL.createObjectURL(f)
        })
    }

    // Shared file-apply logic — runs duration gate for free users
    async function applyFile(selected) {
        if (subscriptionStatus === 'free') {
            const duration = await getVideoDuration(selected)
            if (duration > FREE_MAX_SECONDS) {
                setDurationError(true)
                setFile(null)
                return
            }
        }
        setDurationError(false)
        setFile(selected)
    }

    async function handleFileChange(e) {
        const selected = e.target.files[0]
        if (selected) await applyFile(selected)
    }

    async function handleDrop(e) {
        e.preventDefault()
        const dropped = e.dataTransfer.files[0]
        if (dropped) await applyFile(dropped)
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    async function handleDemoVideo() {
        setLoadingDemo(true)
        try {
            const response = await fetch(DEMO_VIDEO_URL)
            const blob = await response.blob()
            const demoFile = new File([blob], 'demo-video.mp4', { type: 'video/mp4' })
            await applyFile(demoFile)
        } catch (err) {
            console.log('error loading demo:', err)
            alert('Could not load demo video. Please try uploading your own.')
        }
        setLoadingDemo(false)
    }

    const atUploadLimit = subscriptionStatus === 'free' && !limitLoading && uploadsThisMonth >= FREE_UPLOAD_LIMIT

    return (
        <div className="min-h-screen bg-black text-white flex flex-col"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <div className="flex-1 flex flex-col items-center p-6 md:p-8">

            {/* Header */}
            <div className="text-center mt-8">
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Court Vision</p>
                <h1 className="text-3xl font-bold">New Session</h1>
                <p className="text-gray-500 mt-2 text-sm">Upload a shooting video to begin analysis</p>
            </div>

            {/* Gate 1: upload limit wall */}
            {limitLoading && subscriptionStatus === 'free' ? (
                <div className="mt-20">
                    <div className="inline-block w-6 h-6 border-2 border-gray-700 border-t-orange-500 rounded-full animate-spin" />
                </div>
            ) : atUploadLimit ? (
                <div className="w-full max-w-lg mt-10 bg-gray-900 border border-orange-500/30 rounded-2xl p-8 text-center"
                    style={{ boxShadow: '0 0 30px rgba(249, 115, 22, 0.08)' }}>
                    <p className="text-3xl mb-4">🔒</p>
                    <h2 className="text-xl font-bold mb-2">Monthly limit reached</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        You've used your {FREE_UPLOAD_LIMIT} free uploads this month. Upgrade to Pro for unlimited analyses.
                    </p>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                    >
                        Upgrade to Pro →
                    </button>
                    <p className="text-gray-600 text-xs mt-4">Resets on the 1st of next month</p>
                </div>
            ) : (
                <>
                    {/* Demo video preview */}
                    <div className="w-full max-w-lg mt-8 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-orange-500 text-xs font-bold tracking-widest uppercase">First time?</p>
                                <p className="text-sm text-gray-300 mt-0.5">See an example shooting video</p>
                            </div>
                        </div>

                        <video
                            src={DEMO_VIDEO_URL}
                            className="w-full"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />

                        <div className="px-5 py-4 border-t border-gray-800">
                            <button
                                onClick={handleDemoVideo}
                                disabled={loadingDemo}
                                className="w-full px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide border border-orange-500/40 text-orange-500 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                            >
                                {loadingDemo ? 'LOADING DEMO...' : 'TRY THIS VIDEO →'}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full max-w-lg flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-gray-800" />
                        <p className="text-gray-600 text-xs uppercase tracking-widest">Or upload your own</p>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Upload zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="w-full max-w-lg border-2 border-dashed rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center gap-4 transition-all duration-200"
                        style={{
                            borderColor: file ? '#f97316' : durationError ? '#ef4444' : '#374151',
                            background: file ? 'rgba(249, 115, 22, 0.05)' : durationError ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                        }}
                    >
                        {file ? (
                            <div className="text-center">
                                <p className="text-orange-500 text-2xl mb-2">✓</p>
                                <p className="text-white font-medium break-all">{file.name}</p>
                                <p className="text-gray-500 text-sm mt-1">Ready to analyze</p>
                            </div>
                        ) : durationError ? (
                            <div className="text-center">
                                <p className="text-red-500 text-2xl mb-2">✕</p>
                                <p className="text-red-400 font-medium text-sm">Video too long</p>
                                <p className="text-gray-500 text-xs mt-2 leading-relaxed max-w-xs">
                                    Free plan supports videos up to 30 seconds.{' '}
                                    <button
                                        onClick={() => navigate('/pricing')}
                                        className="text-orange-500 hover:text-orange-400 underline"
                                    >
                                        Upgrade to Pro
                                    </button>{' '}
                                    for unlimited.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-gray-600 text-4xl mb-3">↑</p>
                                <p className="text-gray-400">Drag and drop your video here</p>
                                <p className="text-gray-600 text-sm mt-1">or</p>
                            </div>
                        )}

                        <label className="mt-4 px-6 py-3 rounded-lg font-bold text-sm tracking-wide cursor-pointer bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-200">
                            BROWSE FILES
                            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>

                    {/* Continue button */}
                    <div className="h-16 mt-6">
                        {file && (
                            <button
                                className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02]"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                                }}
                                onClick={() => navigate('/zone-select', { state: { file } })}
                            >
                                CONTINUE →
                            </button>
                        )}
                    </div>
                </>
            )}
            </div>
            <Footer/>
        </div>
    )
}