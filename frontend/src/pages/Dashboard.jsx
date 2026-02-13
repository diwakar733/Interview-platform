import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../utils/api'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchInterviews()
    }
  }, [user])

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/interviews')
      setInterviews(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch interviews:', err)
      setInterviews([])
      setError('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = () => {
    navigate('/create-room')
  }

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Ensure we always render something
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading user information...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interview Platform</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {user.role === 'interviewer' && (
          <button
            onClick={handleCreateRoom}
            className="mb-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            + Create New Interview Room
          </button>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : interviews && interviews.length > 0 ? (
            interviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Room: {interview.roomId}
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Interviewer:</span> {interview.interviewer?.name || 'Unknown'}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Candidate:</span> {interview.candidate?.name || 'Not joined'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString() : 'No date'}
                </p>
                {interview.status === 'active' && (
                  <button
                    onClick={() => handleJoinRoom(interview.roomId)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Join
                  </button>
                )}
                {interview.status === 'completed' && (
                  <div className="text-center text-green-600 font-semibold">
                    Completed - Rating: {interview.rating || 'N/A'}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No interviews yet</p>
              {user.role === 'interviewer' && (
                <button
                  onClick={handleCreateRoom}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Create Your First Interview Room
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
