import mongoose from 'mongoose'

const interviewSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    code: {
      type: String,
      default: '// Start coding here...\n',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    feedback: {
      type: String,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Interview', interviewSchema)
