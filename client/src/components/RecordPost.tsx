import React, { useState, useRef } from 'react';
import axios from 'axios';

interface Constraints {
  audio: {
    noiseSuppression: boolean,
    echoCancellation: boolean
  }
  video: boolean
}
const constraints: Constraints = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true
  },
  video: false
}

export const RecordPost = ({ user, audioContext, title, categories, openPost, filter, synthAudioChunks }: { user: any; audioContext:AudioContext; title: string; categories: string[]; openPost: () => void, filter: any, synthAudioChunks: Blob[] }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const userId = user.id;
  
  // functionality for recording/filtering the audio
  const lowpass = audioContext.createBiquadFilter();
  if (filter.lowPassFrequency) {
    lowpass.frequency.value = filter.lowPassFrequency;
  } else {
    lowpass.frequency.value = 350;
  }
  lowpass.type = 'lowpass';
  const highpass = audioContext.createBiquadFilter();
  if (filter.highPassFrequency) {
    highpass.frequency.value = filter.highPassFrequency
  } else {
    highpass.frequency.value = 350
  }
  highpass.type = 'highpass';


  const initializeStream = async () => {
    if (!audioStream) {
      audioContext.resume();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setAudioStream(stream);
      return stream
    }
    audioContext.resume();
    return audioStream
  }
  const resumeAudioContext = async () => {
    if (audioContext.state === 'suspended') {
      try {
        audioContext.resume()
      } catch (error) {
        console.error("error resuming audiocontext")
      }
    }
  }
  const startRecording = async () => {
    const destination: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
    try {
      resumeAudioContext();
      const stream = await initializeStream();
      setAudioChunks([]);

      const source = audioContext.createMediaStreamSource(stream);

      const destination = audioContext.createMediaStreamDestination();

      // if the filter is the default setting
      if (Object.values(filter).length === 4) {
        source.connect(destination);
        // if the filter is one of my self-made filters
      } else if (Object.values(filter).length > 4) {
        const options: any = Object.values(filter).slice(4)
        source.connect(lowpass)
        lowpass.connect(highpass)
        highpass.connect(options[0])
        options[0].connect(options[1])
        options[1].connect(options[2])
        options[2].connect(destination);
      } else {
        source.connect(destination);
      }

      mediaRecorder.current = new MediaRecorder(destination.stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data])
        }
      }
      mediaRecorder.current.start();
      setIsRecording(true);

    } catch (error) { console.error(error) }
  };

  const stopRecording = async () => {
    if (mediaRecorder?.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
    audioContext.suspend()
    stopStream();
  };

  const stopStream = async () => {
    audioStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setAudioStream(null)
  }

  const playAudio = async (): Promise<void> => {
    resumeAudioContext();
    if (!audioContext) {
      console.error('something was null: ', audioChunks.length === 0, !audioContext);
      return;
    }
    let audioBlob: Blob;
    // either voice or synth audio is played back
    synthAudioChunks.length > 0
      ?
      audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' }) : audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const arrayBuffer = await audioBlob.arrayBuffer();
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null');
          return;
        }
        audioSource.current = audioContext.createBufferSource();
        audioSource.current.buffer = buffer;
        audioSource.current.connect(audioContext.destination);

        audioSource.current.onended = () => {
          setIsPlaying(false);
        };
        audioSource.current.start();
        setIsPlaying(true);
      },
      (error) => {
        console.error('error playing audio: ', error);
      },
    ).catch((playError) => {
      console.error('error playing: ', playError);
    });
  };

  const stopPlaying = () => {
    if (audioSource.current) {
      audioSource.current.stop();
      setIsPlaying(false);
    }
  };

  const emptyRecording = () => {
    setAudioChunks([]);
  };

  const saveAudioToGoogleCloud = async () => {
    let audioBlob: Blob;
    // either synth or voice audio is saved
    synthAudioChunks.length > 0 ?
      audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' }) : audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', title)
      categories.forEach((category, index) => {
        console.log('foreach', category, index);
        formData.append(`category[${index}]`, category);
      });
      const response = await axios.post('/upload', formData);
      if (response.status === 200) {
        console.info('Audio save successfully');
      } else {
        console.error('Error saving audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ margin: '15px' }}>
      <button
        className="record-button"
        onClick={startRecording}
        disabled={isRecording}
      ><img src={require('../style/recordbutton.png')} /></button>
      <button
        className="play-button"
        onClick={playAudio}
        // if either of the chunks has a valid length => either one can be played back
        disabled={isPlaying || (audioChunks.length === 0 && synthAudioChunks.length === 0)}
      ><img src={require('../style/playbutton.png')} /></button>
      <button
        className="stop-button"
        onClick={isRecording ? stopRecording : stopPlaying}
        disabled={!isRecording && !isPlaying}
      ><img src={require('../style/stopbutton.png')} /></button>
      <button
        className="delete-button"
        onClick={() => {
          emptyRecording()
          stopStream()
        }
        }

        disabled={audioChunks.length === 0 || isRecording}
      ><img src={require('../style/deletebutton.png')} /></button>
      <button
        className="post-button"
        onClick={() => {
          openPost();
          saveAudioToGoogleCloud();
          stopStream();
        }
        }
        // if either set of chunks is valid then that version of audio can be saved
        disabled={(audioChunks.length === 0 && synthAudioChunks.length === 0) || isRecording}
      ><img src={require('../style/postbutton.png')} /></button>
    </div >
  );
};
