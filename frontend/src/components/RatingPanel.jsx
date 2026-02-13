import { useState } from 'react'
import API from '../utils/api'

const RatingPanel = ({ roomId, onClose }) => {
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await API.post(`/interviews/${roomId}/rate`, {
        rating,
        feedback,
      })
      onClose()
    } catch (err) {
      console.error('Failed to submit rating:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Interview</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Rating (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center mt-2 text-2xl font-bold text-blue-500">
            {rating}/10
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feedback for the candidate..."
            rows="4"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RatingPanel
