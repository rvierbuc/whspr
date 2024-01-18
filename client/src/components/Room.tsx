import React, { ChangeEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import AgoraRTC from 'agora-rtc-sdk';
// import agoraConfig from '../agoraConfig'
import Analyser from './Analyser'
import { joinChannel, leaveChannel, startAudio, stopAudio, createChannel, subscribeRemoteUser } from './AgoraClient';
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios'



const Room = ({ channel, host, id, creator, audioContext }) => {

  const [channelName, setChannelName] = useState("a");
  const [uid, setUid] = useState<number>(id);
  const [stream, setStream] = useState<MediaStream>();
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<string[]>([]);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const [mute, setMute] = useState<boolean>(false)
  const [listeners, setListeners] = useState<any>([])
  const [owner, setOwner] = useState<string>(host)
  const navigate = useNavigate()
  const user: any = useLoaderData();


    useEffect(() => {
      console.log('creator', channel)
      if(user.username !== owner){
        setListeners([user])
      }
        navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
             console.log('user', user)

        createChannel(channel, uid, '007eJxTYGA5vi/0oVHez1zh26WN9zf6ljmFlfq+u2q64U2i2e6es+sVGBKNk5INTEwTLcwsLUwszM0tjFIMUs0Mk4xNzSwsLU2NsrhXpDYEMjK4Fk1lYIRCEJ+RIZGBAQAzyx5E', stream);
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
    joinChannel(channel, uid, '007eJxTYGA5vi/0oVHez1zh26WN9zf6ljmFlfq+u2q64U2i2e6es+sVGBKNk5INTEwTLcwsLUwszM0tjFIMUs0Mk4xNzSwsLU2NsrhXpDYEMjK4Fk1lYIRCEJ+RIZGBAQAzyx5E');
    startAudio();
  };

  const muted = () => {
    setMute(!mute)
    stopAudio();

  }

  const handleLeaveChannel = (stream) => {
    leaveChannel();
    //console.log('stream', stream);
    stopAudio();
    if(user.username === owner){
      axios.delete(`/post/radio/${user.username}`)
      .then(() => {
        console.log('done')
      }).catch(() => {
        console.log('uhh')
      })
    }
    navigate('/protected/radio')
  };
  
  return (
    
    <div>
      <div style={{justifyContent: 'right', flexDirection: 'row', display: 'flex', alignItems: 'right'}}>

      <img
            onClick={handleLeaveChannel}
            src={require('../style/icons8-leave-32.png')}
            style={{width: '50px', margin: '20px', justifyContent: 'right'}}
          />
      </div>

    <div style={{ alignItems: 'center'}} className='container'>
   
      <h1>{channel}</h1>

      
      <div className='card'>

      <audio ref={remoteAudioRef} autoPlay />


       
       <div className='room-info'>
          <img style={{marginLeft: '15px', marginTop: '15px'}} width="100" src="https://lh3.googleusercontent.com/a/ACg8ocI6UOrLKNPeKzMpAobwFfMo2jVBc2SccK66hzTPMkEk=s96-c" alt="user profile image" />
          {/* <div style={{justifyContent: 'center', flexDirection: 'column'}}>
            <h1>hi</h1>
            <h1>hi</h1>
          </div> */}
       {mute ?  <button
       style={{margin: '15px'}}
        type="button"
        className='btn btn-dark'
        onClick={() => {muted()}}
        >Unmute</button> : <button
        style={{margin: '15px'}}
        type="button"
        className='btn btn-light'
        onClick={() => {muted()}}
        >Mute</button>}

       </div>
      
      <br />
      {/* <button
      type="button"
      className='btn btn-dark'
    onClick={handleLeaveChannel}>Leave Channel</button> */}
      </div>

      <div style={{ marginTop: '20px',  alignItems: 'center'}} className='container'>

        <div className='card'>
          <div className='room-users'>
            { listeners ?
            listeners.map((listener) => {
              <img style={{margin: '15px'}} width="100" src={listener.profileImgUrl} alt="user profile image" />
              {mute ?  <button
                type="button"
                style={{margin: '15px'}}
        className='btn btn-dark'
        onClick={() => {muted()}}
        >Unmute</button> : <button
        type="button"
        style={{margin: '15px'}}
        className='btn btn-light'
        onClick={() => {muted()}}
        >Mute</button>}
      }) : <br></br>
    }
        <Analyser audioContext={audioContext}  stream={stream}/>
          {/* <img style={{margin: '15px'}} width="100" src="https://lh3.googleusercontent.com/a/ACg8ocI6UOrLKNPeKzMpAobwFfMo2jVBc2SccK66hzTPMkEk=s96-c" alt="user profile image" />
       {mute ?  <button
        type="button"
        style={{margin: '15px'}}
        className='btn btn-dark'
        onClick={() => {muted()}}
        >Unmute</button> : <button
        type="button"
        style={{margin: '15px'}}
        className='btn btn-light'
        onClick={() => {muted()}}
        >Mute</button>} */}


          </div>
          
        </div>

        
      </div>

      
    </div>
    </div>
  );
};

export default Room;