import React, { useState, useRef } from 'react';
import AudioTag from './AudioTag';
import axios from 'axios';

interface Props {
  audioContext: AudioContext;
  mediaDest: MediaStreamAudioDestinationNode;
  finalDest: AudioDestinationNode
  start: () => void;
  stop: () => void;
}

const RecordSynth = ({ audioContext, finalDest, mediaDest, start, stop }: Props) => {
  const [audioSource, setAudioSource] = useState<string>('Howdy');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaSource, setMediaSource] = useState<MediaSource>()

  // setup the media recorder
  const recorder: MediaRecorder = new MediaRecorder(mediaDest.stream);
  const track: MediaSource = new MediaSource();

  // start the sound/recording
  const startRecording = async () => {
    try {
      recorder.ondataavailable = event => {
        console.log(event.data.size);
        setAudioChunks((prevChunks) => [...prevChunks, event.data])
      };
      recorder.start();
      start();
    } catch(error) {
      console.error('Could not start recording', error)
    }
  };
  console.log('Record', audioSource);
  // stop the sound/recording
  const stopRecording = async () => {
    try {
      stop();
      recorder.stop();
      recorder.onstop = async () => {
        let blob: string = URL.createObjectURL(new Blob(audioChunks, {type: 'audio/wav'}));
        setAudioSource(blob.slice(5));
        console.log(audioSource);
      };
    } catch(error) {
      console.error('Could not stop recording', error);
    }
  };

  const saveRecording = async () => {
    const saveBlob: Blob = new Blob(audioChunks, {type: 'audio/wav'})
    try {
      const formData: FormData = new FormData();
      formData.append('audio', saveBlob);
      const response = await axios.post('/upload', formData);
      if (response.status === 200) {
        console.log('Synth saved to cloud');
      } else {
        console.error('Error saving synth', response.statusText);
      }
    } catch(error) {
      console.error('Error saving audio', error);
    }
  };

  return (
    <div>
      <h3>Record the synth</h3>
      <div>
        <button onClick={start}>Play</button>
        <button onClick={stop}>Stop</button>
        <button onClick={startRecording}>Record</button>
        <button onClick={stopRecording}>Stop Record</button>
        <button onClick={saveRecording}>Save</button>
      </div>
      <div>
        <AudioTag source={audioSource} />
      </div>
    </div>
  );
};

export default RecordSynth;