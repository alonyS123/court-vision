import { useLocation, useNavigate } from "react-router-dom"
import { useState} from 'react'



export default function Calibration() {

    const [points, setPoints] = useState([]);
    const [videoReady, setVideoReady] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const file = location.state?.file;

    const videoUrl = file ? URL.createObjectURL(file) : null;




  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Court Calibration</h1>
        {points.length === 0 && <p>Click the center of the hoop</p>}
        {points.length === 1 && <p>Hoop marked! Ready to continue</p>}   
        <div 
            className="relative w-full max-w-3xl mt-8"
            style={{ cursor: 'crosshair' }}
            onClick={(e) => {
                if (points.length >= 1) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log('click:', x, y);
                setPoints([...points, { x, y }]);
            }}
        >

            <video
                src={videoUrl}
                className="w-full"
            />
            {points.map((point, index) => (
                <div
                    key={index}
                    className="absolute w-4 h-4 bg-green-500 rounded-full"
                    style={{
                        left: point.x - 8,
                        top: point.y - 8,
                    }}
                >
                    <span className="text-white text-xs ml-5">{index + 1}</span>
                </div>
            ))}
        </div>
    <div className="h-12 mt-4">
            {points.length===1 && 
            <button className="mr-4" onClick={ ()=> {setPoints([])}}>Undo click</button>
        }
        {points.length===1 && 
            <button onClick={()=> {
                 navigate('/analysis', { state: { file, hoopPosition: points[0] } })
            }}>Continue</button>
        }
    </div>
</div>
)
}