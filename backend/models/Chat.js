import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    senderName: { type: String },
    message: { type: String, required: true },
    meta: { type: Object },
  },
  { timestamps: true }
)

export default mongoose.model('Chat', chatSchema)
