import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import ShotChart from './ShotChart'
import { supabase } from '../supabase'

export default function Analysis() {

    
    const [detections, setDetections] = useState([])
    const [currentBalls, setCurrentBalls] = useState([])
    const [hoopDetections, setHoopDetections] = useState([])
     const [analysisComplete, setAnalysisComplete] = useState(false)
     const [finalShots, setFinalShots] = useState([])
     const hoopDetectionsRef = useRef([])
     const [analyzing, setAnalyzing] = useState(true)
     const [progress, setProgress] = useState(0)

    const location = useLocation()
    const file = location.state?.file
    const zone = location.state?.zone
    const videoUrl = useMemo(() => {
        return file ? URL.createObjectURL(file) : null
    }, [file])
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const detectionsRef = useRef([])


    async function analyzeVideo() {
    setDetections([])
    setHoopDetections([])
    setCurrentBalls([])
    setAnalysisComplete(false)
    setFinalShots([])
    const startTime = Date.now()
    setAnalyzing(true)
    setProgress(0)
    detectionsRef.current = []
    hoopDetectionsRef.current = []

    const video = videoRef.current
    video.currentTime = 0

    const duration = video.duration
    const interval = 0.3
    let currentTime = 0

    try{

    while (currentTime < duration) {
        video.currentTime = currentTime
        await new Promise(resolve => {
    video.onseeked = resolve
    setTimeout(resolve, 500)
})
        await detectFrameAsync(video)
        setProgress(Math.round((currentTime / duration) * 100))
        currentTime += interval
    }

    const shots = detectShotsFromRef()
    setFinalShots(shots)
    setAnalysisComplete(true)
    setAnalyzing(false)
    setProgress(100)
    if (shots.length > 0) {
        saveSession(shots)
    } else {
        console.log('no shots detected, session not saved')
    }

    }catch(error){
         console.log('analysis error:', error)
    setAnalyzing(false)
    alert('Analysis failed. Please try again.')
    }
}

    function getAverageHoopPosition() {
    if (hoopDetectionsRef.current.length === 0) return null
    let totalX = 0
    let totalY = 0
    hoopDetectionsRef.current.forEach((det) => {
        totalX += det.hoops[0].x
        totalY += det.hoops[0].y
    })
    return {
        x: totalX / hoopDetectionsRef.current.length,
        y: totalY / hoopDetectionsRef.current.length
    }
}

   function detectShotsFromRef() {
    const hoopPos = getAverageHoopPosition()
    if (!hoopPos) return []

    const dets = detectionsRef.current
    let shots = []
    let risingFrames = 0
    let peakRising = 0

    for (let i = 1; i < dets.length; i++) {
        const prevY = dets[i - 1].balls[0].y
        const currY = dets[i].balls[0].y
        const currX = dets[i].balls[0].x

        if (currY < prevY) {
            risingFrames++
        } else {
            risingFrames = 0
        }

        if (risingFrames > peakRising) {
            peakRising = risingFrames
        }

        const distance = Math.sqrt(
            (hoopPos.x - currX) * (hoopPos.x - currX) +
            (hoopPos.y - currY) * (hoopPos.y - currY)
        )

        if (peakRising >= 2 && distance < 150) {
            let made = false
            if (i + 2 < dets.length) {
                const nextY = dets[i + 1].balls[0].y
                const nextX = dets[i + 1].balls[0].x
                const nextNextY = dets[i + 2].balls[0].y
                const yMovedDown = nextY > currY && nextNextY > nextY
                const xStaySimilar = Math.abs(nextX - currX) < 200
                if (yMovedDown && xStaySimilar) {
                    made = true
                }
            }

            const shooterIndex = Math.max(0, i - 4)
            const shooterX = dets[shooterIndex].balls[0].x
            const shooterY = dets[shooterIndex].balls[0].y
            shots.push({ time: dets[i].time, distance: distance, made: made, shooterX: shooterX, shooterY: shooterY })
            risingFrames = 0
            peakRising = 0
        }
    }
    return shots
}

async function detectFrameAsync(element) {
    if (element.videoWidth === 0) return

    const canvas = canvasRef.current
    canvas.width = element.videoWidth
    canvas.height = element.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(element, 0, 0)
    const image = canvas.toDataURL('image/jpeg')

    try {
        const response = await axios({
            method: 'POST',
            url: import.meta.env.VITE_ROBOFLOW_MODEL_URL,
            params: {
                api_key: import.meta.env.VITE_ROBOFLOW_API_KEY,
                confidence: 30
            },
            data: image,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const predictions = response.data.predictions
        const balls = predictions.filter((item) => item.class === 'Ball' && item.confidence > 0.6)
        if (balls.length > 0) {
            setCurrentBalls(balls)
            setDetections((prev) => [...prev, { time: element.currentTime, balls }])
            detectionsRef.current = [...detectionsRef.current, { time: element.currentTime, balls }]
        }

        const hoops = predictions.filter((item) => item.class === 'Hoop')
        if (hoops.length > 0) {
            setHoopDetections((prev) => [...prev, { time: element.currentTime, hoops }])
            hoopDetectionsRef.current = [...hoopDetectionsRef.current, { time: element.currentTime, hoops }]
        }
    } catch (error) {
        console.log('detection error:', error.message)
    }
}

async function saveSession(shots) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const makes = shots.filter(s => s.made).length
    const misses = shots.filter(s => !s.made).length
    const percentage = shots.length > 0 ? Math.round(makes / shots.length * 100) : 0

    const { data: session, error } = await supabase
        .from('sessions')
        .insert({
            user_id: user.id,
            zone: zone,
            total_shots: shots.length,
            makes: makes,
            misses: misses,
            shooting_percentage: percentage
        })
        .select()
        .single()

    if (error) {
        console.log('error saving session:', error.message)
        return
    }

    for (const shot of shots) {
        await supabase
            .from('shots')
            .insert({
                session_id: session.id,
                time: shot.time,
                made: shot.made,
                distance: shot.distance
            })
    }
}

useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    setAnalyzing(true)
    video.onloadedmetadata = () => {
        analyzeVideo()
    }
}, [])

   return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        
        {!analysisComplete && !analyzing && (
            <>
                <p className="text-orange-500 text-sm font-bold tracking-widest uppercase">Court Vision</p>
                <h1 className="text-3xl font-bold mt-2">Analysis</h1>
            </>
        )}

        {analyzing && (
            <div className="mt-10 w-80 text-center">
                <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                        style={{ 
                            width: progress + '%',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)'
                        }}
                    />
                </div>
                <p className="text-orange-500 text-2xl font-bold mt-4">{progress}%</p>
                <p className="text-gray-400 text-sm mt-2">Analyzing your shots...</p>
                <p className="text-gray-600 text-xs mt-1">{detections.length} balls detected</p>
            </div>
        )}

        <div className="relative w-full max-w-3xl mt-6 rounded-lg overflow-hidden px-4" 
    style={{ display: (!analyzing && !analysisComplete) ? 'block' : 'none' }}>
    <video
        ref={videoRef}
        src={videoUrl}
        className="w-full"
        controls
    />
</div>

        {analysisComplete && (
            <div className="w-full max-w-3xl mt-8">
                <ShotChart shots={finalShots} zone={zone} />
            </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
)
}
