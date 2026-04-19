export default function ShotChart({ shots, zone }) {
    const makes = shots.filter(s => s.made).length
    const misses = shots.filter(s => !s.made).length
    const pct = shots.length > 0 ? Math.round(makes / shots.length * 100) : 0

    const zones = [
        { name: 'Left Close', label: 'Left Close', col: 0, row: 0 },
        { name: 'Center Close', label: 'Paint', col: 1, row: 0 },
        { name: 'Right Close', label: 'Right Close', col: 2, row: 0 },
        { name: 'Left Mid', label: 'Left Wing', col: 0, row: 1 },
        { name: 'Center Mid', label: 'Free Throw', col: 1, row: 1 },
        { name: 'Right Mid', label: 'Right Wing', col: 2, row: 1 },
        { name: 'Left Far', label: 'Left Corner', col: 0, row: 2 },
        { name: 'Center Far', label: 'Top of Key', col: 1, row: 2 },
        { name: 'Right Far', label: 'Right Corner', col: 2, row: 2 },
    ]

    return (
        <div className="bg-black text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* Header */}
            <div className="text-center pt-8 pb-4">
                <p className="text-orange-500 text-xs font-bold tracking-widest uppercase">Session Complete</p>
                <h1 className="text-2xl font-bold mt-1">Shot Analysis</h1>
            </div>

            {/* Big percentage hero */}
            <div className="flex justify-center my-6">
                <div className="relative w-36 h-36">
                    <svg className="w-36 h-36" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r="60" fill="none" stroke="#1f2937" strokeWidth="8" />
                        <circle cx="70" cy="70" r="60" fill="none" 
                            stroke={pct >= 50 ? '#22c55e' : '#ef4444'} 
                            strokeWidth="8"
                            strokeDasharray={377}
                            strokeDashoffset={377 - (377 * pct / 100)}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-4xl font-bold" style={{ color: pct >= 50 ? '#22c55e' : '#ef4444' }}>{pct}%</p>
                        <p className="text-gray-600 text-xs uppercase tracking-wide">Accuracy</p>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-3 px-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex-1 max-w-28 text-center">
                    <p className="text-2xl font-bold">{shots.length}</p>
                    <p className="text-gray-600 text-xs mt-1 uppercase tracking-wide">Shots</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex-1 max-w-28 text-center">
                    <p className="text-2xl font-bold text-green-500">{makes}</p>
                    <p className="text-gray-600 text-xs mt-1 uppercase tracking-wide">Makes</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex-1 max-w-28 text-center">
                    <p className="text-2xl font-bold text-red-500">{misses}</p>
                    <p className="text-gray-600 text-xs mt-1 uppercase tracking-wide">Misses</p>
                </div>
            </div>

            {/* Court zone map */}
            <div className="mt-10 px-4">
                <p className="text-gray-600 text-xs font-bold tracking-widest uppercase mb-3">Shot Location</p>
                <div className="relative">
                    <svg width="300" height="260" viewBox="0 0 300 260" className="mx-auto">
                        <defs>
                            <linearGradient id="courtBg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#111827" />
                                <stop offset="100%" stopColor="#0a0f1a" />
                            </linearGradient>
                        </defs>

                        {/* Court */}
                        <rect x="20" y="5" width="260" height="250" rx="4" fill="url(#courtBg)" stroke="#1f2937" strokeWidth="1.5" />
                        <rect x="95" y="5" width="110" height="110" fill="none" stroke="#1f2937" strokeWidth="1" />
                        <circle cx="150" cy="115" r="48" fill="none" stroke="#1f2937" strokeWidth="1" />
                        <line x1="95" y1="115" x2="205" y2="115" stroke="#1f2937" strokeWidth="1" />
                        <rect x="127" y="5" width="46" height="3" rx="1" fill="#f97316" opacity="0.6" />
                        <circle cx="150" cy="14" r="6" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
                        <path d="M 30 252 Q 30 70 150 50 Q 270 70 270 252" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.2" />

                        {/* Zone overlays */}
                        {zones.map((z) => {
                            const isActive = z.name === zone
                            const zoneShots = isActive ? shots : []
                            const zoneMakes = zoneShots.filter(s => s.made).length
                            const zoneTotal = zoneShots.length
                            const zonePct = zoneTotal > 0 ? Math.round(zoneMakes / zoneTotal * 100) : null

                            const w = 80, h = z.row === 2 ? 70 : z.row === 1 ? 75 : 80
                            const x = 23 + z.col * 85
                            const y = z.row === 0 ? 8 : z.row === 1 ? 88 : 163

                            return (
                                <g key={z.name}>
                                    <rect x={x} y={y} width={w} height={h} rx="3"
                                        fill={isActive ? (zonePct >= 50 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent'}
                                        stroke={isActive ? (zonePct >= 50 ? '#22c55e' : '#ef4444') : 'transparent'}
                                        strokeWidth="1.5"
                                    />
                                    {isActive && zoneTotal > 0 ? (
                                        <>
                                            <text x={x + w/2} y={y + h/2 - 8} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                                                {zoneMakes}/{zoneTotal}
                                            </text>
                                            <text x={x + w/2} y={y + h/2 + 10} textAnchor="middle" 
                                                fill={zonePct >= 50 ? '#22c55e' : '#ef4444'} fontSize="12" fontWeight="bold">
                                                {zonePct}%
                                            </text>
                                        </>
                                    ) : (
                                        <text x={x + w/2} y={y + h/2 + 3} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="9">
                                            {z.label}
                                        </text>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                </div>
            </div>

            {/* Shot timeline */}
            <div className="mt-10 px-4 pb-8">
                <p className="text-gray-600 text-xs font-bold tracking-widest uppercase mb-3">Timeline</p>
                {shots.length === 0 && (
                    <p className="text-gray-700 text-sm">No shots detected</p>
                )}
                {shots.map((shot, index) => (
                    <div key={index} className="flex items-center py-3 border-b border-gray-900">
                        <div className={`w-2 h-2 rounded-full mr-4 ${shot.made ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-gray-500 text-sm w-20">Shot {index + 1}</span>
                        <span className="text-gray-600 text-sm w-20">{shot.time.toFixed(1)}s</span>
                        <span className={`text-sm font-bold ${shot.made ? 'text-green-500' : 'text-red-500'}`}>
                            {shot.made ? 'Made' : 'Missed'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Back button */}
            <div className="px-4 pb-10 text-center">
                <button 
                    className="px-8 py-3 rounded-lg font-bold text-sm tracking-wide"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)' }}
                    onClick={() => window.location.href = '/dashboard'}
                >
                    BACK TO DASHBOARD →
                </button>
            </div>
        </div>
    )
}