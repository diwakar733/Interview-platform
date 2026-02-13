import Interview from '../models/Interview.js'

export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id)

    socket.on('join-room', async (data) => {
      try {
        const { roomId, userId, userName } = data
        socket.join(roomId)

        // Update interview with candidate if they're joining
        const interview = await Interview.findOne({ roomId })
        if (interview && !interview.candidate && userId !== interview.interviewer.toString()) {
          interview.candidate = userId
          await interview.save()
        }

        const roomSockets = io.sockets.adapter.rooms.get(roomId)
        const users = Array.from(roomSockets || []).map((socketId) => {
          const socketObj = io.sockets.sockets.get(socketId)
          return {
            socketId,
            userId: socketObj?.data?.userId,
            userName: socketObj?.data?.userName,
          }
        })

        // Store user data
        socket.data = { userId, userName, roomId }

        // Emit to all users in room
        io.to(roomId).emit('room-joined', { users, message: `${userName} joined` })
      } catch (err) {
        console.error('Join room error:', err)
      }
    })

    socket.on('code-change', (data) => {
      const { roomId, code } = data
      socket.to(roomId).emit('receive-code', { code })
    })

    socket.on('language-change', (data) => {
      const { roomId, language } = data
      socket.to(roomId).emit('language-change', { language })
    })

    socket.on('offer', (data) => {
      const { roomId, offer } = data
      socket.to(roomId).emit('offer', { offer })
    })

    socket.on('answer', (data) => {
      const { roomId, answer } = data
      socket.to(roomId).emit('answer', { answer })
    })

    socket.on('ice-candidate', (data) => {
      const { roomId, candidate } = data
      socket.to(roomId).emit('ice-candidate', { candidate })
    })

    socket.on('end-interview', async (data) => {
      try {
        const { roomId } = data
        const interview = await Interview.findOneAndUpdate(
          { roomId },
          { status: 'completed', endTime: new Date() }
        )

        io.to(roomId).emit('interview-ended', { message: 'Interview has ended' })
        socket.leave(roomId)
      } catch (err) {
        console.error('End interview error:', err)
      }
    })

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id)
      const { roomId } = socket.data
      if (roomId) {
        const roomSockets = io.sockets.adapter.rooms.get(roomId)
        const users = Array.from(roomSockets || []).map((socketId) => {
          const socketObj = io.sockets.sockets.get(socketId)
          return {
            socketId,
            userId: socketObj?.data?.userId,
            userName: socketObj?.data?.userName,
          }
        })

        io.to(roomId).emit('user-left', { users })
      }
    })
  })
}
