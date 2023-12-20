import React, { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import AgoraRTC from 'agora-rtc-sdk';
// import agoraConfig from '../agoraConfig'
import { joinChannel, leaveChannel, startAudio, stopAudio, createChannel, subscribeRemoteUser } from './AgoraClient';
import { useLoaderData, useNavigate } from 'react-router-dom';



const Room = ({ channel, host, id }) => {

  const [channelName, setChannelName] = useState(channel);
  const [uid, setUid] = useState<number>(id);
  const [stream, setStream] = useState<MediaStream>();
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<string[]>([]);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const navigate = useNavigate()
  const user: any = useLoaderData();

    useEffect(() => {
      console.log('stream', user)
        navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
             console.log('stream', user)

        createChannel(channelName, uid, '007eJxTYPBdOLtmftV7Yz+P1GfSx08pdH/dXbfQbEfv229pB0S8KjYpMCQaJyUbmJgmWphZWphYmJtbGKUYpJoZJhmbmllYWpoaHTlcktoQyMggWH2RlZEBAkF8RoZEBgYAV0cfRw==', stream);
        setStream(stream);
      });

    subscribeRemoteUser((user, mediaType) => {
      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        user.audioTrack.play();
        setRemoteAudioTracks((prevTracks) => [...prevTracks, remoteAudioTrack]);

        remoteAudioRef.current = remoteAudioTrack;
      }
    });
  }, [remoteAudioTracks]);

  const handleJoinChannel = (stream) => {
    joinChannel(channelName, uid, '007eJxTYPBdOLtmftV7Yz+P1GfSx08pdH/dXbfQbEfv229pB0S8KjYpMCQaJyUbmJgmWphZWphYmJtbGKUYpJoZJhmbmllYWpoaHTlcktoQyMggWH2RlZEBAkF8RoZEBgYAV0cfRw==');
    startAudio();
  };

  const handleLeaveChannel = (stream) => {
    leaveChannel();
    console.log('stream', stream);
    stopAudio();
    navigate('/protected/radio')
  };

  return (
    <div>
      <h1>{channelName}</h1>
      <audio ref={remoteAudioRef} autoPlay />


          <img src="https://lh3.googleusercontent.com/a/ACg8ocI6UOrLKNPeKzMpAobwFfMo2jVBc2SccK66hzTPMkEk=s96-c" alt="user profile image" />
        
      
      <br />
      <button onClick={handleLeaveChannel}>Leave Channel</button>
    </div>
  );
};

export default Room;