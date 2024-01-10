import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Tone from 'tone';

interface Props {
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
  user: any
  audioContext:AudioContext
  title: string
  categories: string[]
  filter: any
  addSynth: boolean
  start: () => void
  stop: () => void
}

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
    echoCancellation: true,
  },
  video: false,
};

export const RecordPost = ({ user, audioContext, title, categories, filter, addSynth, instrument, start, stop }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const userId = user.id;

  // navigate functionality
  const navigate = useNavigate();
  const handleNavigation: (path: string) => void = (path: string) => navigate(path);

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
    highpass.frequency.value = filter.highPassFrequency;
  } else {
    highpass.frequency.value = 350;
  }
  highpass.type = 'highpass';


  const initializeStream = async (): Promise<MediaStream> => {
    if (!audioStream) {
      audioContext.resume();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setAudioStream(stream);
      return stream;
    }
    audioContext.resume();
    return audioStream;
  };
  const resumeAudioContext: () => void = async () => {
    if (audioContext.state === 'suspended') {
      try {
        audioContext.resume();
      } catch (error) {
        console.error('error resuming audiocontext');
      }
    }
  };
  const startRecording = async (): Promise<void> => {
    try {
      resumeAudioContext();
      setAudioChunks([]);
      const stream = await initializeStream();
      const destination: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

      const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
      // if the filter is the default setting
      if (Object.values(filter).length === 4) {
        source.connect(destination);
        // if the filter is one of my self-made filters
      } else if (Object.values(filter).length > 4) {
        const options: any[] = Object.values(filter).slice(4);
        source.connect(lowpass);
        lowpass.connect(highpass);
        highpass.connect(options[0]);
        options[0].connect(options[1]);
        options[1].connect(options[2]);
        options[2].connect(destination);
      } else {
        source.connect(destination);
      }

      mediaRecorder.current = new MediaRecorder(destination.stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
      mediaRecorder.current.start();
      setIsRecording(true);

    } catch (error) { console.error(error); }
  };

  const stopRecording = async (): Promise<void> => {
    if (mediaRecorder?.current?.state === 'recording') {
      if (addSynth) {
        stop();
      }
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
    audioContext.suspend();
    stopStream();
  };

  const stopStream = async (): Promise<void> => {
    audioStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setAudioStream(null);
  };

  const startSynthRecording = async () => {
    try {
      const context = Tone.context;
      resumeAudioContext();
      setSynthAudioChunks([]);
      const destination = context.createMediaStreamDestination();
      instrument.connect(destination);
      mediaRecorder.current = new MediaRecorder(destination.stream);
      mediaRecorder.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setSynthAudioChunks((prevChunks: Blob[]) => [...prevChunks, event.data])
        }
      };
      mediaRecorder.current.start();
      start();
      setIsRecording(true);
    } catch(error) {
      console.error('Could not start recording', error)
    }
  };

  const playAudio = async (): Promise<void> => {
    resumeAudioContext();
    if (!audioContext) {
      console.error('something was null: ', audioChunks.length === 0, !audioContext);
      return;
    }
    let audioBlob: Blob;
    // either voice or synth audio is played back
    if (synthAudioChunks.length > 0) {
      audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' });
    } else {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    }
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

        audioSource.current.onended = (): void => {
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

  const stopPlaying: () => void = () => {
    if (audioSource.current) {
      audioSource.current.stop();
      setIsPlaying(false);
    }
  };

  const emptyRecording: () => void = () => {
    setAudioChunks([]);
  };

  const saveAudioToGoogleCloud = async (): Promise<void> => {
    handleNavigation('/protected/feed/following');
    let audioBlob: Blob;
    // either synth or voice audio is saved
    if (synthAudioChunks.length > 0) {
      audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' });
    } else {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    }
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('userId', userId);
      formData.append('title', title);
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
    <div className="d-flex justify-content-center mt-3">
      <Stack direction="horizontal" gap={3}>
        <button
          //className="record-button"
          //style={{height:'5rem', width:'5rem'}}
          id='record-btn-new'
          onClick={() => {
            if (addSynth) {
              startSynthRecording();
            } else {
              startRecording();
            }
          }}
          disabled={isRecording || audioChunks.length > 0}
        >
          {/* <img src={require('../style/recordbutton.png')} /> */}
          </button>
        <button
          id='play-btn-new'
          //className="play-button"
          onClick={playAudio}
          // if either of the chunks has a valid length => either one can be played back
          disabled={isPlaying || (audioChunks.length === 0 && synthAudioChunks.length === 0)}
        >
          {/* <img src={require('../style/playbutton.png')} /> */}
          </button>
        <button
          id='stop-btn-new'
          //style={{height:'4rem', width:'4rem'}}
          //className="stop-button"
          onClick={isRecording ? stopRecording : stopPlaying}
          disabled={!isRecording && !isPlaying}
        >
          {/* <img src={require('../style/stopbutton.png')} /> */}
          </button>
        <button
          id='remove-btn-new'
          className="delete-button"
          onClick={() => {
            emptyRecording()
            stopStream()
          }
          }

          disabled={audioChunks.length === 0 || isRecording}
        >
          {/* <img src={require('../style/deletebutton.png')} /> */}
          </button>
        <button
          id='post-btn-new'
          //className="post-button"
          onClick={() => {
            saveAudioToGoogleCloud();
            stopStream();
          }
          }
          // if either set of chunks is valid then that version of audio can be saved
          disabled={(audioChunks.length === 0 && synthAudioChunks.length === 0) || isRecording}
        >
          {/* <img src={require('../style/postbutton.png')} /> */}
          </button>
      </Stack>
    </div >
  );
};
