import React, { useEffect, useRef, useState } from 'react';
// import {io, Socket} from 'socket.io-client'
import Peer from 'peerjs'
import AgoraRTC from 'agora-rtc-sdk'
// import agoraConfig from '../agoraConfig'
import { joinChannel, leaveChannel, startAudio, stopAudio, createChannel, subscribeRemoteUser } from './AgoraClient';


// const socket: Socket = io('http://localhost:3000')

const Room = () => {
    // const [stream, setStream] = useState()
    // const [me, setMe] = useState('')

    // const myAudioRef = useRef()
    // const userAudioRef = useRef()
    // useEffect(() => {
    //     const peer = new Peer( {
    //         host: '/',
    //         port: 3000,
    //         path: '/peerjs',
    //         debug: 3,
            
    //     })
    //     navigator.mediaDevices.getUserMedia({video: false, audio: true})
    //     .then((stream) => {
    //         setStream(stream)
    //         myAudioRef.current.srcObject = stream
    //     })

    //     socket.on('id', (id) => {
    //         setMe(id)
    //     })

       
    //     console.log('ppp', peer)
    //     peer.on('open', (id) => {
    //         console.log('hello', id)
    //         socket.emit('call', {
    //             user: me,
    //             signal: id,
    //             from: me,
    //             name: me
    //         })




    //         // socket.on('start-call', (callerId: string) => {
    //         //     navigator.mediaDevices.getUserMedia({audio: true})
    //         //     .then((stream) => {
    //         //         console.log('yoo')
    //         //     const call = peer.call(callerId,  stream)
    //         //     if(call) {
    //         //         call.on('stream', (remoteStream) => {
    //         //             if(audioRef.current){
    //         //                 audioRef.current.srcObject = remoteStream
    //         //             }
    //         //         })
    //         //     }
    //         // })
    //         // })

    //         // socket.on('user-joined', (userId: string) => {
    //         //     console.log('UserConnected')
    //         // })
    //         // socket.on('disconnected', (userId: string) => {
    //         //     conssole.log('User disconnected ', userId)
    //         // })

    //     })

    //     peer.on('error', (error) => {
    //         console.error('error', error)
    //     })

    //     peer.on('stream', (stream) => {
    //         userAudioRef.current.srcObject = stream
    //     })

    //     socket.on('accepted', (signal) => {
    //     })

    //     // peer.on('call', (call) => {
    //     //     navigator.mediaDevices.getUserMedia({video: false, audio: true})
    //     //     .then((stream) => {
    //     //         call.answer(stream)

    //     //         call.on('stream', (remoteStream) => {
    //     //             if(audioRef.current){
    //     //                 audioRef.current.srcObject = remoteStream
    //     //                 audioRef.current.play()
    //     //                 .catch((err) => {
    //     //                     console.error('playback error', err)
    //     //                 })
    //     //             }
    //     //         })
    //     //     })
    //     // })



    //     return () => {
    //         peer.destroy()
    //         socket.disconnect()
    //     }
    // }, [])

    // return (
    //     <div>
    //         <h1>Radio</h1>
    //        <audio  autoPlay  controls/>
    //        <audio ref={myAudioRef} autoPlay />

    //     </div>
    // )

    const [channelName, setChannelName] = useState('a');
  const [uid, setUid] = useState(Math.floor(Math.random() * 20));
  const [stream, setStream] = useState(null)
  const [remoteAudioTracks, setRemoteAudioTracks] = useState([]);

    // const myAudioRef = useRef()
    const remoteAudioRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
            console.log('stream', stream)

            createChannel(channelName, uid, '007eJxTYKgWsDPcLGWb3m1/Tn3i7d/c7wSSFl88dDPJzO3PLo75zccVGBKNk5INTEwTLcwsLUwszM0tjFIMUs0Mk4xNzSwsLU2NzsYWpTYEMjIsYr3AwsgAgSA+I0MiAwMArvYdPg==', stream)
            setStream(stream)
             //myAudioRef.current.srcObject = stream
        })

        subscribeRemoteUser((user, mediaType) => {
            if (mediaType === 'audio') {
              const remoteAudioTrack = user.audioTrack;
                user.audioTrack.play()
              setRemoteAudioTracks((prevTracks) => [...prevTracks, remoteAudioTrack]);

              remoteAudioRef.current = remoteAudioTrack
            }
          });
    }, [remoteAudioTracks])

  const handleJoinChannel = (stream) => {
    joinChannel(channelName, uid, '007eJxTYKgWsDPcLGWb3m1/Tn3i7d/c7wSSFl88dDPJzO3PLo75zccVGBKNk5INTEwTLcwsLUwszM0tjFIMUs0Mk4xNzSwsLU2NzsYWpTYEMjIsYr3AwsgAgSA+I0MiAwMArvYdPg==');
    startAudio(stream);
  };

  const handleLeaveChannel = (stream) => {
    leaveChannel();
    console.log('stream', stream)
    stopAudio(stream);
  };

  return (
    <div>
      <h1>Agora Voice Chat</h1>
      {console.log('hi', remoteAudioRef)}
      {/* <audio ref={myAudioRef} autoPlay /> */}
      <audio ref={remoteAudioRef} autoPlay />


      <div>
      {/* {remoteAudioTracks.map((track, index) => (
          <audio key={index} ref={remoteAudioRef} srcObject={new MediaStream(track)} autoPlay />
        ))} */}
      </div>
      <label>
        Channel Name:
        <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
      </label>
      <br />
      <label>
        User ID:
        <input type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
      </label>
      <br />
      <button onClick={(stream) => handleJoinChannel(stream)}>Join Channel</button>
      <button onClick={handleLeaveChannel}>Leave Channel</button>
    </div>
  );
}

export default Room;