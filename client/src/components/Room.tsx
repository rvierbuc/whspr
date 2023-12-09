import React, { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
// import {io, Socket} from 'socket.io-client'
import Peer from 'peerjs'
import AgoraRTC from 'agora-rtc-sdk'
// import agoraConfig from '../agoraConfig'
import { joinChannel, leaveChannel, startAudio, stopAudio, createChannel, subscribeRemoteUser } from './AgoraClient';


// const socket: Socket = io('http://localhost:3000')

const Room: React.FC = () => {

  const [channelName, setChannelName] = useState('a');
  const [uid, setUid] = useState<number>(Math.floor(Math.random() * 20));
  const [stream, setStream] = useState<MediaStream>()
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<string[]>([]);

    // const myAudioRef = useRef()
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
            console.log('stream', stream)

            createChannel(channelName, uid, '007eJxTYPBdOLtmftV7Yz+P1GfSx08pdH/dXbfQbEfv229pB0S8KjYpMCQaJyUbmJgmWphZWphYmJtbGKUYpJoZJhmbmllYWpoaHTlcktoQyMggWH2RlZEBAkF8RoZEBgYAV0cfRw==', stream)
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
    joinChannel(channelName, uid, '007eJxTYPBdOLtmftV7Yz+P1GfSx08pdH/dXbfQbEfv229pB0S8KjYpMCQaJyUbmJgmWphZWphYmJtbGKUYpJoZJhmbmllYWpoaHTlcktoQyMggWH2RlZEBAkF8RoZEBgYAV0cfRw==');
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
        <input type="text" value={uid} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUid(Number(event.target.value))} />
      </label>
      <br />
      <button onClick={(stream) => handleJoinChannel(stream)}>Join Channel</button>
      <button onClick={handleLeaveChannel}>Leave Channel</button>
    </div>
  );
}

export default Room;