import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className="border-t border-gray-900 py-8 px-6 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <span className="font-bold text-sm">Court Vision</span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-xs">© 2026 Court Vision. All rights reserved.</p>
          <Link to="/privacy-policy" className="text-gray-600 text-xs hover:text-gray-400 transition-all">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}