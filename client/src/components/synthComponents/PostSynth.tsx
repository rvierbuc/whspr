import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Button } from 'react-bootstrap';

interface Props {
  userId: any
  synthAudioChunks: Blob[]
  isRecording: boolean
  audioContext: AudioContext
  filter: any
}

interface Constraints {
  audio: {
    noiseSuppression: boolean,
    echoCancellation: boolean
  }
  video: boolean
}

const PostSynth = ({ filter, audioContext, isRecording, synthAudioChunks, userId}: Props) => {
  const [ title, setTitle ] = useState('');
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audio = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  // const destination: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const navigate = useNavigate();
  const handleNavigation = async (path: string) => navigate(path);

  // functionality for recording/filtering the audio
  const lowpass = audioContext.createBiquadFilter();
  lowpass.frequency.value = filter.lowPassFrequency;
  lowpass.type = filter.lowPassType;
  const highpass = audioContext.createBiquadFilter();
  highpass.frequency.value = filter.highPassFrequency;
  highpass.type = filter.highPassType;

  const constraints: Constraints = {
    audio: {
      noiseSuppression: true,
      echoCancellation: true
    },
    video: false
  }
  // setting the new blob to save to the db and cloud
  const categories: string[] = ['Voice Filter', 'Filter', 'Robot', 'Alien', 'Underwater'];
  let audioBlob: Blob;
  if (!audioChunks.length && synthAudioChunks.length) {
    audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' });
  } else if (audioChunks.length && !synthAudioChunks.length) {
    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  }

  // start the recording
  const startRecording = async () => {
    try {
      setAudioChunks([]);
      const destination: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaRecorder.current = new MediaRecorder(destination.stream);
      const source = audioContext.createMediaStreamSource(stream);
      console.log('source', source.mediaStream.id)
      console.log('destination', destination.stream.id)
      if (Object.values(filter).length > 4) {
        let options: any = Object.values(filter).slice(4)
        source.connect(lowpass)
        lowpass.connect(highpass)
        highpass.connect(options[0])
        options[0].connect(options[1])
        options[1].connect(options[2])
        options[2].connect(destination);
      } else { source.connect(destination) }
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {setAudioChunks((prevChunks) => [...prevChunks, event.data])}
      }
      mediaRecorder.current.start();
      setIsAudioRecording(true); // This is stopping the voice filters from staying disabled
    } catch (error) {console.error(error)}
  };

  // audio playback
  const playAudio = async (): Promise<void> => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    const arrayBuffer = await audioBlob.arrayBuffer()
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null')
          return
        }
        audio.current = audioContext.createBufferSource()
        audio.current.buffer = buffer
        audio.current.connect(audioContext.destination);
        audio.current.onended = () => {setIsPlaying(false)}
        audio.current.start()
        setIsPlaying(true)
      },
      (error) => console.error('error playing audio: ', error)
    ).catch((playError) => console.error('error playing: ', playError))
  }


  // sends audio file to db and cloud
  const saveAudioToGoogleCloud = async () => {
    const postTitle = title;
    setTitle('');
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', postTitle);
      categories.forEach((category, index) => {
        formData.append(`category[${index}]`, category);
      });
      const response = await axios.post('/upload', formData);
      response.status === 200 ? console.info('Audio saved successfully') : console.error('Error saving audio', response.statusText);
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  const stopRecording = async () => {
    console.log(mediaRecorder.current?.state)
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsAudioRecording(false);
    }
  };

  const stopPlaying = () => {
    if (audio.current) {
      audio.current.stop();
      setIsPlaying(false);
    }
  };

  const emptyRecording = () => {
    setAudioChunks([])
  };

  return (
    <Container className="d-flex justify-content-center my-3 pt-3 synthRecorder rounded w-75">
      <Stack direction="vertical">
        <div>
          <input type="text"
          maxLength={25}
          placeholder="What's on your mind?"
          value={title}
          onChange={(e) => { setTitle(e.target.value) }}
          className='input-control text-white'
          />
        </div>
        <div>
          <button className="record-button mx-2" onClick={startRecording} disabled={isAudioRecording}><img src={require('../../style/recordbutton.png')} /></button>
          <button className="play-button mx-2" onClick={playAudio} disabled={audioChunks.length === 0 }><img src={require('../../style/playbutton.png')} /></button>
          <button className="stop-button mx-2" onClick={isAudioRecording ? stopRecording : stopPlaying} ><img src={require('../../style/stopbutton.png')} /></button>
          <button className="delete-button mx-2" onClick={emptyRecording} disabled={audioChunks.length === 0 || isAudioRecording}><img src={require('../../style/deletebutton.png')} /></button>
          <button className="post-button m-2" onClick={saveAudioToGoogleCloud} disabled={isAudioRecording} ><img src={require('../../style/postbutton.png')} /></button>
        </div>
      </Stack>
    </Container>
  );
};

export default PostSynth;