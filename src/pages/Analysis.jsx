import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import ShotChart from './ShotChart'
import { supabase } from '../supabase'



async function createPoseDetector() {
    const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    
    const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    )
    
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task' ,
            delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1
    })
    
    return poseLandmarker
}

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
    const poseLandmarkerRef = useRef(null)
    const poseDetectionsRef = useRef([])


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

    // Initialize MediaPipe pose detector (once)
    if (!poseLandmarkerRef.current) {
        poseLandmarkerRef.current = await createPoseDetector()
    }
    poseDetectionsRef.current = []

    const video = videoRef.current
    video.currentTime = 0

    const duration = video.duration
    const interval = 0.1
    let currentTime = 0

    try{

    while (currentTime < duration) {
        video.currentTime = currentTime
        await new Promise(resolve => {
    video.onseeked = resolve
    setTimeout(resolve, 500)
})
        await detectFrameAsync(video)
        await detectPoseAsync(video)
        setProgress(Math.round((currentTime / duration) * 100))
        currentTime += interval
    }
    detectionsRef.current = filterDetections(detectionsRef.current)
    
    const shots = detectShotsFromRef()

    const shotsWithArc = shots.map(shot => {
        const points = calculateArcForShot(shot, detectionsRef.current)
        if (!points) return { ...shot, arc: null }
        const parabola = fitParabola(points)
        const arc = getArcMetrics(points, parabola)
        return { ...shot, arc }
    })

    const shotsWithForm = shotsWithArc.map(shot => {
        const form = calculateFormForShot(shot, poseDetectionsRef.current)
        return { ...shot, form }
    })
    setFinalShots(shotsWithForm)
    setAnalysisComplete(true)
    setAnalyzing(false)
    setProgress(100)
    if (shotsWithForm.length > 0) {
        saveSession(shotsWithForm)
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

function filterDetections(dets) {
    if (dets.length < 2) return dets
    
    const MAX_JUMP = 300 // max pixels ball can reasonably move between frames
    const filtered = [dets[0]] // always keep first detection
    
    for (let i = 1; i < dets.length; i++) {
        const prev = filtered[filtered.length - 1].balls[0]
        const curr = dets[i].balls[0]
        const dx = curr.x - prev.x
        const dy = curr.y - prev.y
        const jump = Math.sqrt(dx * dx + dy * dy)
        
        if (jump <= MAX_JUMP) {
            filtered.push(dets[i])
        }
    }
    
    return filtered
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
            i += 15 
        }
    }
    return shots
}

function calculateArcForShot(shot, detections) {
    const window = detections.filter(d => 
        d.time >= shot.time - 1.0 && d.time <= shot.time + 0.5
    )
    if (window.length < 3) return null

    const points = window.map(d => ({ x: d.balls[0].x, y: d.balls[0].y }))
    return points
}

function fitParabola(points) {
    // Least squares fit: y = ax² + bx + c
    const n = points.length
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0
    let sumY = 0, sumXY = 0, sumX2Y = 0

    for (const p of points) {
        sumX  += p.x
        sumX2 += p.x ** 2
        sumX3 += p.x ** 3
        sumX4 += p.x ** 4
        sumY  += p.y
        sumXY += p.x * p.y
        sumX2Y += p.x ** 2 * p.y
    }

    // Solve 3x3 linear system for a, b, c
    const A = [[sumX4, sumX3, sumX2], [sumX3, sumX2, sumX], [sumX2, sumX, n]]
    const B = [sumX2Y, sumXY, sumY]
    const [a, b, c] = solveLinearSystem(A, B)
    return { a, b, c }
}

function solveLinearSystem(A, B) {
    // Gaussian elimination to solve Ax = B
    const n = A.length
    for (let i = 0; i < n; i++) {
        let max = i
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(A[j][i]) > Math.abs(A[max][i])) max = j
        }
        [A[i], A[max]] = [A[max], A[i]];
        [B[i], B[max]] = [B[max], B[i]]

        for (let j = i + 1; j < n; j++) {
            const factor = A[j][i] / A[i][i]
            B[j] -= factor * B[i]
            for (let k = i; k < n; k++) {
                A[j][k] -= factor * A[k][i]
            }
        }
    }

    const x = new Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
        x[i] = B[i]
        for (let j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j]
        }
        x[i] /= A[i][i]
    }
    return x
}

function getArcMetrics(points, parabola) {
    const { a, b, c } = parabola

    // Release angle — slope at the first point, converted to degrees
    const firstX = points[0].x
    const releaseSlope = 2 * a * firstX + b
    const releaseAngle = Math.abs(Math.atan(releaseSlope) * (180 / Math.PI))

    // Peak height — x coordinate of vertex is -b/2a
    const peakX = -b / (2 * a)
    const peakY = a * peakX ** 2 + b * peakX + c

    // Entry angle — slope at the last point, converted to degrees
    const lastX = points[points.length - 1].x
    const entrySlope = 2 * a * lastX + b
    const entryAngle = Math.abs(Math.atan(entrySlope) * (180 / Math.PI))

    return { releaseAngle, peakY, entryAngle }
}

function calculateAngle(a, b, c) {
    // Returns the angle at point b (in degrees) formed by points a-b-c
    const ab = { x: a.x - b.x, y: a.y - b.y }
    const cb = { x: c.x - b.x, y: c.y - b.y }
    
    const dot = ab.x * cb.x + ab.y * cb.y
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2)
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2)
    
    const cosAngle = dot / (magAB * magCB)
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)))
    
    return angleRad * (180 / Math.PI)
}

function calculateFormForShot(shot, poseDetections) {
    // Get pose frames in the 1 second before the shot (release window)
    const window = poseDetections.filter(p =>
        p.time >= shot.time - 2.0 && p.time <= shot.time
    )
    if (window.length < 3) return null

    // Smooth out spike frames where elbow angle changes impossibly fast
const smoothedWindow = window.filter((frame, i) => {
    if (i === 0) return true
    const prev = window[i - 1]
    const s1 = prev.landmarks[12], e1 = prev.landmarks[14], w1 = prev.landmarks[16]
    const s2 = frame.landmarks[12], e2 = frame.landmarks[14], w2 = frame.landmarks[16]
    if (s1.visibility < 0.5 || e1.visibility < 0.5 || w1.visibility < 0.5) return true
    if (s2.visibility < 0.5 || e2.visibility < 0.5 || w2.visibility < 0.5) return true
    const a1 = calculateAngle(s1, e1, w1)
    const a2 = calculateAngle(s2, e2, w2)
    return Math.abs(a2 - a1) < 40 // reject spikes
})

    // Find the release frame — the one closest to shot.time (highest point of arm)
    // Find the frame where the wrist is highest — that's the actual release moment
    let releaseFrame = window[0]
    let highestWristY = Infinity
    for (const frame of smoothedWindow) {
        const wristLm = frame.landmarks[16]
        if (wristLm.visibility > 0.5 && wristLm.y < highestWristY) {
            highestWristY = wristLm.y
            releaseFrame = frame
        }
    }

  // Find set-point by smallest elbow angle in the 0.5s before release
// (this isolates the actual loaded position, not the resting hold)
let setPointFrame = null
let minElbowAngle = Infinity
for (const frame of smoothedWindow) {
    const timeBefore = releaseFrame.time - frame.time
    if (timeBefore <= 0 || timeBefore > 1.5) continue
    const s = frame.landmarks[12]
    const e = frame.landmarks[14]
    const w = frame.landmarks[16]
    if (s.visibility > 0.5 && e.visibility > 0.5 && w.visibility > 0.5) {
        const angle = calculateAngle(s, e, w)
        if (angle < minElbowAngle) {
            minElbowAngle = angle
            setPointFrame = frame
        }
    }
}
if (!setPointFrame) setPointFrame = window[0]

    const lm = releaseFrame.landmarks

    // Use right side by default (we can add handedness detection later)
    const shoulder = lm[12]
    const elbow = lm[14]
    const wrist = lm[16]
    const hip = lm[24]
    const knee = lm[26]
    const ankle = lm[28]
    const nose = lm[0]

    // Check visibility — bail if key joints aren't clearly visible
    if (shoulder.visibility < 0.5 || elbow.visibility < 0.5 || wrist.visibility < 0.5) {
        return null
    }

        // Elbow angle at release (should be ~140-160°)
    const releaseElbowAngle = calculateAngle(shoulder, elbow, wrist)

    // Elbow angle at set-point (should be ~90°)
    const sp = setPointFrame.landmarks
    let setPointElbowAngle = null
    if (sp[12].visibility > 0.5 && sp[14].visibility > 0.5 && sp[16].visibility > 0.5) {
        setPointElbowAngle = calculateAngle(sp[12], sp[14], sp[16])
    }
    

    // Release point height — wrist position relative to nose (negative = above head)
    const releasePointHeight = nose.y - wrist.y

    // Knee bend — find the frame with lowest hip (deepest bend) in the window
    let minHipY = -Infinity
    let kneeBendFrame = null
    for (const frame of smoothedWindow) {
        const h = frame.landmarks[24]
        if (h.visibility > 0.5 && h.y > minHipY) {
            minHipY = h.y
            kneeBendFrame = frame
        }
    }
    
    let kneeBend = null
    if (kneeBendFrame) {
        const kb = kneeBendFrame.landmarks
        if (kb[24].visibility > 0.5 && kb[26].visibility > 0.5 && kb[28].visibility > 0.5) {
            kneeBend = calculateAngle(kb[24], kb[26], kb[28])
        }
    }


   return {
    releaseElbowAngle: Math.round(releaseElbowAngle),
    setPointElbowAngle: setPointElbowAngle !== null ? Math.round(setPointElbowAngle) : null,
    releasePointHeight: Math.round(releasePointHeight * 1000) / 1000,
    kneeBend: kneeBend !== null ? Math.round(kneeBend) : null
}
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

async function detectPoseAsync(element) {
    if (element.videoWidth === 0) return
    if (!poseLandmarkerRef.current) return

    try {
        const timestamp = performance.now()
        const result = poseLandmarkerRef.current.detectForVideo(element, timestamp)
        
        if (result.landmarks && result.landmarks.length > 0) {
            poseDetectionsRef.current.push({
                time: element.currentTime,
                landmarks: result.landmarks[0]
            })
        }
    } catch (error) {
        console.log('pose detection error:', error.message)
    }
}

async function saveSession(shots) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    console.log('saveSession received shots:', JSON.stringify(shots, null, 2))

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
            distance: shot.distance,
            release_angle: shot.arc?.releaseAngle ?? null,
            entry_angle: shot.arc?.entryAngle ?? null,
            peak_y: shot.arc?.peakY ?? null,
            set_point_elbow_angle: shot.form?.setPointElbowAngle ?? null,
            release_elbow_angle: shot.form?.releaseElbowAngle ?? null,
            knee_bend: shot.form?.kneeBend ?? null,
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

