import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

function App() {
  const [peerId, setPeerId] = useState('')
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
  const remoteVideoRef = useRef(null)
  const peerInstance = useRef(null)

  useEffect(() => {
    const peer = new Peer()

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('call', function (call) {
      call.answer()
      call.on('stream', function (remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play()
      })
    })

    peerInstance.current = peer
  }, [])

  const call = (remotePeerId) => {
    const mediaOptions = {
      video: {
        cursor: 'always',
        quality: 10,
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: true,
    }

    navigator.mediaDevices
      .getDisplayMedia(mediaOptions)
      .then(function (mediaStream) {
        peerInstance.current.call(remotePeerId, mediaStream)
      })
  }

  return (
    <div className='App'>
      <h4>{peerId}</h4>
      <input
        type='text'
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video
          style={{ width: 640, height: 360 }}
          ref={remoteVideoRef}
          controls
        />
      </div>
    </div>
  )
}

export default App
