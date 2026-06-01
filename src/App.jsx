import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'
import Upload from './pages/Upload'
import Calibration from './pages/Calibration'
import Analysis from './pages/Analysis'
import ZoneSelect from './pages/ZoneSelect'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'
import Chat from './pages/chat'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App(){
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calibration" element={<Calibration/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/zone-select" element={<ProtectedRoute><ZoneSelect /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
    </BrowserRouter>




  )
}

export default App