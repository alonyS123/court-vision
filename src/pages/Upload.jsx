import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
    const [file, setFile] = useState(null)
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

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Court Vision</p>
            <h1 className="text-3xl font-bold">New Session</h1>
            <p className="text-gray-500 mt-2 text-sm">Upload a shooting video to begin analysis</p>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full max-w-lg mt-8 border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center gap-4 transition-all duration-200"
                style={{ 
                    borderColor: file ? '#f97316' : '#374151',
                    background: file ? 'rgba(249, 115, 22, 0.05)' : 'transparent'
                }}
            >
                {file ? (
                    <div className="text-center">
                        <p className="text-orange-500 text-2xl mb-2">✓</p>
                        <p className="text-white font-medium">{file.name}</p>
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

            <div className="h-16 mt-6">
                {file && (
                    <button 
                        className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200"
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
        </div>
    )
}