// AgoraClient.ts
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
import socket from './socket';
import agoraConfig from '../agoraConfig'

const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8', appid: agoraConfig.appId, certificate: '15dcfaf2bbc54c83946a127f1a77c18e' });
const localAudioStream: ILocalAudioTrack =  AgoraRTC.createMicrophoneAudioTrack()


export const joinChannel = async (channelName: string, uid: number, token: string) => {
  try {
    await agoraClient.join(agoraConfig.appId, channelName, token, uid);
    socket.emit('join-channel', channelName, uid);
  } catch (error) {
    console.error('Failed to join channel', error);
  }
};

export const leaveChannel = () => {
  agoraClient.leave();
  socket.emit('leave-channel');
};

export const startAudio = async (stream: MediaStream) => {
    const localAudioStream: ILocalAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack()
    console.log('why', localAudioStream)
  agoraClient.publish(localAudioStream);
};

export const stopAudio = async (stream) => {
    try {
        const localAudioStream: ILocalAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack()
        agoraClient.unpublish(stream);
    } catch (error) {
        console.error('no', error)
    }
};

export const createChannel = async (channelName: string, uid: number, token: string, stream: MediaStream) => {
  try {
    
      const localAudioStream: ILocalAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack()
    
      
      console.log('yes', agoraConfig.appId)
      
      // localAudioStream.setStream(stream)
      await agoraClient.join('a3bc045a8698487782d0e61b35689952', channelName, token, uid);
      console.log('break')
    await agoraClient.publish(localAudioStream);
    console.log('break2')
  } catch (error) {
    console.error('Failed to create channel', error);
  }
};

export const subscribeRemoteUser = (callback) => {
    agoraClient.on('user-published', async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
  
      if (callback) {
        callback(user, mediaType);
      }
    });
  };