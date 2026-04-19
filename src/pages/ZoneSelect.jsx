import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const zones = [
    { name: 'Left Close', label: 'Left\nClose', x: 28, y: 12, width: 78, height: 115 },
    { name: 'Center Close', label: 'Paint', x: 106, y: 12, width: 88, height: 115 },
    { name: 'Right Close', label: 'Right\nClose', x: 194, y: 12, width: 78, height: 115 },
    { name: 'Left Mid', label: 'Left\nWing', x: 28, y: 127, width: 78, height: 78 },
    { name: 'Center Mid', label: 'Free\nThrow', x: 106, y: 127, width: 88, height: 78 },
    { name: 'Right Mid', label: 'Right\nWing', x: 194, y: 127, width: 78, height: 78 },
    { name: 'Left Far', label: 'Left\nCorner', x: 28, y: 205, width: 78, height: 68 },
    { name: 'Center Far', label: 'Top of\nKey', x: 106, y: 205, width: 88, height: 68 },
    { name: 'Right Far', label: 'Right\nCorner', x: 194, y: 205, width: 78, height: 68 },
]

export default function ZoneSelect() {
    const [selectedZone, setSelectedZone] = useState(null)
    const [hoveredZone, setHoveredZone] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    const file = location.state?.file

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            <div className="text-center mb-2">
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Court Vision</p>
                <h1 className="text-3xl font-bold tracking-tight">Where are you shooting from?</h1>
                <p className="text-gray-500 mt-2 text-sm">Tap your position on the court</p>
            </div>

            <div className="relative mt-6" style={{ filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.08))' }}>
                <svg width="300" height="285" viewBox="0 0 300 285">
                    <defs>
                        <linearGradient id="courtGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    <rect x="25" y="8" width="250" height="270" rx="4" fill="url(#courtGrad)" />
                    <rect x="25" y="8" width="250" height="270" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
                    <rect x="100" y="8" width="100" height="118" fill="none" stroke="#334155" strokeWidth="1.5" />
                    <circle cx="150" cy="126" r="50" fill="none" stroke="#334155" strokeWidth="1.5" />
                    <line x1="100" y1="126" x2="200" y2="126" stroke="#334155" strokeWidth="1.5" />
                    <rect x="128" y="8" width="44" height="3" rx="1" fill="#f97316" opacity="0.8" />
                    <circle cx="150" cy="16" r="7" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.9" />
                    <line x1="145" y1="23" x2="147" y2="30" stroke="#f97316" strokeWidth="0.5" opacity="0.4" />
                    <line x1="150" y1="23" x2="150" y2="31" stroke="#f97316" strokeWidth="0.5" opacity="0.4" />
                    <line x1="155" y1="23" x2="153" y2="30" stroke="#f97316" strokeWidth="0.5" opacity="0.4" />
                   <path d="M 35 8 Q 35 220 150 240 Q 265 220 265 8" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.4" />

                    {zones.map((zone) => {
                        const isSelected = selectedZone === zone.name
                        const isHovered = hoveredZone === zone.name
                        return (
                            <rect
                                key={zone.name}
                                x={zone.x}
                                y={zone.y}
                                width={zone.width}
                                height={zone.height}
                                rx="3"
                                fill={isSelected ? 'rgba(249, 115, 22, 0.25)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent'}
                                stroke={isSelected ? '#f97316' : isHovered ? 'rgba(255,255,255,0.15)' : 'transparent'}
                                strokeWidth={isSelected ? "2" : "1"}
                                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                onClick={() => setSelectedZone(zone.name)}
                                onMouseEnter={() => setHoveredZone(zone.name)}
                                onMouseLeave={() => setHoveredZone(null)}
                            />
                        )
                    })}

                    {zones.map((zone) => {
                        const isSelected = selectedZone === zone.name
                        const lines = zone.label.split('\n')
                        return (
                            <text
                                key={zone.name + '-label'}
                                x={zone.x + zone.width / 2}
                                y={zone.y + zone.height / 2 - (lines.length > 1 ? 5 : 0)}
                                textAnchor="middle"
                                fill={isSelected ? '#f97316' : 'rgba(255,255,255,0.25)'}
                                fontSize="11"
                                fontWeight={isSelected ? '600' : '400'}
                                style={{ pointerEvents: 'none', transition: 'all 0.2s ease' }}
                            >
                                {lines.map((line, i) => (
                                    <tspan key={i} x={zone.x + zone.width / 2} dy={i === 0 ? 0 : 14}>
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        )
                    })}
                </svg>
            </div>

            <div className="h-8 mt-4">
                {selectedZone && (
                    <p className="text-orange-500 text-sm font-medium">{selectedZone}</p>
                )}
            </div>

            <div className="h-14">
                {selectedZone && (
                    <button
                        className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-200"
                        style={{ 
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                        }}
                        onClick={() => navigate('/analysis', { state: { file, zone: selectedZone } })}
                    >
                        START ANALYSIS →
                    </button>
                )}
            </div>
        </div>
    )
}