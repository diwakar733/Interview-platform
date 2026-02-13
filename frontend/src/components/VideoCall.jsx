import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { socket } from '../utils/socket'

const VideoCall = forwardRef(({ roomId }, ref) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)

  useImperativeHandle(ref, () => ({
    stopConnection: () => {
      console.log('Stopping video call connection...')
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
        setLocalStream(null)
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    },
  }))

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
        setLocalStream(stream)
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Initialize WebRTC
        initializePeerConnection(stream)
      } catch (err) {
        console.error('Error accessing media devices:', err)
      }
    }

    startMedia()

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initializePeerConnection = async (stream) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    })

    peerConnectionRef.current = peerConnection

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream)
    })

    peerConnection.ontrack = (evt) => {
      setRemoteStream(evt.streams[0])
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = evt.streams[0]
      }
    }

    peerConnection.onicecandidate = (evt) => {
      if (evt.candidate) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: evt.candidate,
        })
      }
    }

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
    }

    socket.on('offer', async (data) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      )
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      socket.emit('answer', { roomId, answer })
    })

    socket.on('answer', async (data) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      )
    })

    socket.on('ice-candidate', async (data) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
      } catch (err) {
        console.error('Error adding ICE candidate:', err)
      }
    })

    // Create and send offer
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    socket.emit('offer', { roomId, offer })
  }

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setCameraOn(!cameraOn)
    }
  }

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setMicOn(!micOn)
    }
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden flex-1 flex flex-col">
      <div className="relative w-full h-full flex">
        {/* Remote Video */}
        <div className="w-full h-full">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-lg">Waiting for other participant...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center gap-4">
        <button
          onClick={toggleCamera}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            cameraOn
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {cameraOn ? 'Camera On' : 'Camera Off'}
        </button>
        <button
          onClick={toggleMic}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {micOn ? 'Mic On' : 'Mic Off'}
        </button>
      </div>
    </div>
  )
})

VideoCall.displayName = 'VideoCall'

export default VideoCall
