import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Tone from 'tone';
import { Modal } from 'react-bootstrap';

interface Props {
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
  user: any
  audioContext: AudioContext
  title: string
  categories: string[]
  filter: any
  addSynth: boolean
  start: () => void
  stop: () => void
  synthFilters: {
    phaseFilter: Tone.Phaser,
    distortionFilter: Tone.Distortion
  }
  synthBypass: {
    phaseFilter: boolean,
    distortionFilter: boolean
  }
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

const RecordPost = ({ synthBypass, synthFilters, user, audioContext, title, categories, filter, addSynth, instrument, start, stop }: Props): React.JSX.Element => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [showConchSendModal, setShowSendConchModal] = useState<boolean>(false);
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

  const stopStream = async (): Promise<void> => {
    audioStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setAudioStream(null);
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


  const startSynthRecording = async (): Promise<void> => {
    if (!synthBypass.phaseFilter) {
      synthFilters.phaseFilter.wet.value = 0;
    } else {
      synthFilters.phaseFilter.wet.value = 0.5;
    }
    if (!synthBypass.distortionFilter) {
      synthFilters.distortionFilter.wet.value = 0;
    } else {
      synthFilters.distortionFilter.wet.value = 0.5;
    }
    try {
      const filters: (Tone.Phaser | Tone.Distortion)[] = Object.values(synthFilters);
      const context = Tone.context;
      const destination = context.createMediaStreamDestination();
      resumeAudioContext();
      setSynthAudioChunks([]);
      instrument.connect(filters[0]);
      filters[0].connect(filters[1]);
      filters[1].connect(destination);
      Tone.start();
      mediaRecorder.current = new MediaRecorder(destination.stream);
      mediaRecorder.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setSynthAudioChunks((prevChunks: Blob[]) => [...prevChunks, event.data]);
        }
      };
      mediaRecorder.current.start();
      start();
      setIsRecording(true);
    } catch (error) {
      console.error('Could not start recording', error);
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
    title = title || 'untitled';
    if (title) {
      handleNavigation('/protected/feed/following');
    } else {
      handleNavigation('/protected/synthesize');
    }

    let audioBlob: Blob;
    // either synth or voice audio is saved
    if (synthAudioChunks.length > 0) {
      audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' });
    } else {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    }
    try {
      if (title) {
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
      } else {
        alert('Please input a title for your track!');
      }
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  const saveConchToGoogleCloud = async (): Promise<void> => {
    handleNavigation('/protected/feed/following');
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    try {
      const users = await axios.get('/post/users');
      const index = Math.floor(Math.random() * (users.data.length - 1));
      const receivingUserId = users.data[index].id;

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('sendingUserId', userId);
      formData.append('title', title);
      categories.forEach((category, ind) => {
        console.log('foreach', category, index);
        formData.append(`category[${ind}]`, category);
      });
      formData.append('receivingUserId', receivingUserId);
      const response = await axios.post('/conch', formData);
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
  
      <Modal show={showConchSendModal} onHide={() => setShowSendConchModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header style={{fontFamily: 'headerFont', textAlign:'center', textShadow: '1px 1px 2px rgb(0, 0, 0)', fontSize: '2.3rem', color:'rgb(54, 89, 169)'}}>
          You have chosen to send a magic conch!
        </Modal.Header>
        <Modal.Body>
          This means your whspr will be sent into our sea of listeners. One listener will be chosen at random to hear your message, and then it will vanish forever! This listener will know who sent it, so keep it kind.
        </Modal.Body>
        <Modal.Footer>
          <button
          style={{backgroundColor:'rgb(63, 133, 42)', color:'#e1e1e1', borderRadius:'.5rem', padding:'.25rem .5rem' }}
          onClick={() => saveConchToGoogleCloud()}
          >
            Set it Free!
          </button>
          <button 
            style={{backgroundColor:'rgb(155, 44, 22)', color:'#e1e1e1', borderRadius:'.5rem', padding:'.25rem .5rem' }}
            onClick={() => setShowSendConchModal(false)}
          >
            Nevermind
          </button>
        </Modal.Footer>
      </Modal>


      <Stack direction="horizontal" gap={3}>
        <button
          id='record-btn-new'
          onClick={() => {
            if (addSynth) {
              startSynthRecording();
            } else {
              startRecording();
            }
          }}
          disabled={isRecording || audioChunks.length > 0}>
        </button>
        <button
          id='play-btn-new'
          onClick={playAudio}
          disabled={isPlaying || (audioChunks.length === 0 && synthAudioChunks.length === 0)}>
        </button>
        <button
          id='stop-btn-new'
          onClick={isRecording ? stopRecording : stopPlaying}
          disabled={!isRecording && !isPlaying}>
        </button>
        <button
          id='remove-btn-new'
          className="delete-button"
          onClick={() => {
            emptyRecording();
            stopStream();
          }}
          disabled={audioChunks.length === 0 || isRecording}>
        </button>
        <button
          id='post-btn-new'
          onClick={() => {
            saveAudioToGoogleCloud();
            stopStream();
          }}
          disabled={(audioChunks.length === 0 && synthAudioChunks.length === 0) || isRecording}>
        </button>
        <button
          id='conch-post-btn-new'
          onClick={() => {
            setShowSendConchModal(true)
            stopStream();
          }}
          disabled={(audioChunks.length === 0 && synthAudioChunks.length === 0) || isRecording}>
        </button>
      </Stack>
    </div >
  );
};

export default RecordPost;