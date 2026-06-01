import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const DEMO_VIDEO_URL = 'https://ermwkfaakpzliqklpuxl.supabase.co/storage/v1/object/public/demo-videos/court%20vision%20test%20video%202.0.mp4'

export default function Upload() {
    const [file, setFile] = useState(null)
    const [loadingDemo, setLoadingDemo] = useState(false)
    const navigate = useNavigate()

    function handleFileChange(e) {
        setFile(e.target.files[0])
    }

    function handleDrop(e) {
        e.preventDefault()
        setFile(e.dataTransfer.files[0])
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
            setFile(demoFile)
        } catch (err) {
            console.log('error loading demo:', err)
            alert('Could not load demo video. Please try uploading your own.')
        }
        setLoadingDemo(false)
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 md:p-8"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div className="text-center mt-8">
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Court Vision</p>
                <h1 className="text-3xl font-bold">New Session</h1>
                <p className="text-gray-500 mt-2 text-sm">Upload a shooting video to begin analysis</p>
            </div>

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
                    borderColor: file ? '#f97316' : '#374151',
                    background: file ? 'rgba(249, 115, 22, 0.05)' : 'transparent'
                }}
            >
                {file ? (
                    <div className="text-center">
                        <p className="text-orange-500 text-2xl mb-2">✓</p>
                        <p className="text-white font-medium break-all">{file.name}</p>
                        <p className="text-gray-500 text-sm mt-1">Ready to analyze</p>
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
            <Footer/>
        </div>
    )
}