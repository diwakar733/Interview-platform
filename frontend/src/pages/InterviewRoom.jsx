import { useEffect, useRef, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import CodeEditor from '../components/CodeEditor'
import VideoCall from '../components/VideoCall'
import Timer from '../components/Timer'
import RatingPanel from '../components/RatingPanel'
import { socket } from '../utils/socket'

const InterviewRoom = () => {
  const { roomId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [roomUsers, setRoomUsers] = useState([])
  const [showRating, setShowRating] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const videoCallRef = useRef(null)
  const timerRef = useRef(null)

  // Use public URL from environment or current location
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin
  const inviteLink = `${publicUrl}/room/${roomId}`

  useEffect(() => {
    socket.emit('join-room', { roomId, userId: user?._id, userName: user?.name })

    socket.on('room-joined', (data) => {
      setRoomUsers(data.users)
    })

    socket.on('user-joined', (data) => {
      setRoomUsers(data.users)
    })

    socket.on('user-left', (data) => {
      setRoomUsers(data.users)
    })

    // Listen for interview-ended event from backend
    socket.on('interview-ended', () => {
      stopEverything()
      navigate('/dashboard')
    })

    return () => {
      socket.off('room-joined')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('interview-ended')
    }
  }, [roomId, user, navigate])

  const stopEverything = () => {
    console.log('Stopping everything...')
    
    // Stop video call (camera, mic, peer connection)
    if (videoCallRef.current) {
      videoCallRef.current.stopConnection()
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Disconnect socket after a short delay
    setTimeout(() => {
      socket.disconnect()
    }, 500)
  }

  const handleEndInterview = () => {
    if (user?.role === 'interviewer') {
      socket.emit('end-interview', { roomId })
      setShowRating(true)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Interview Room</h1>
          <p className="text-sm text-gray-400">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer />
          <div className="text-sm">
            <p className="font-semibold">{roomUsers.length} participant(s)</p>
            {roomUsers.map((u) => (
              <span key={u.userId} className="block text-gray-400">
                {u.userName}
              </span>
            ))}
          </div>
          {user?.role === 'interviewer' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Invite Candidate
              </button>
              <button
                onClick={handleEndInterview}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                End Interview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Video Section */}
        <div className="flex-1 flex flex-col gap-4">
          <VideoCall roomId={roomId} ref={videoCallRef} />
        </div>

        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col gap-4">
          <CodeEditor roomId={roomId} />
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invite Candidate</h2>
            
            <p className="text-gray-600 mb-4">
              Share this link with the candidate to join the interview:
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-between">
              <code className="text-sm text-gray-800 break-all flex-1">{inviteLink}</code>
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full mb-3 py-2 px-4 rounded font-semibold transition ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? '✓ Link Copied!' : 'Copy Link'}
            </button>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <p className="text-xs text-gray-500 mb-3">
                <strong>For Local Network:</strong> Candidate can join directly at the URL above
              </p>
              <p className="text-xs text-gray-500">
                <strong>For Remote Access:</strong> Use ngrok to expose your application and share the ngrok URL
              </p>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rating Panel */}
      {showRating && user?.role === 'interviewer' && (
        <RatingPanel roomId={roomId} onClose={() => setShowRating(false)} />
      )}
    </div>
  )
}

export default InterviewRoom
