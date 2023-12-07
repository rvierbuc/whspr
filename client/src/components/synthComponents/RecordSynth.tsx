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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<string>('Howdy');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioBuffer = useRef<AudioBufferSourceNode | null>(null);
  const recorder: MediaRecorder = new MediaRecorder(mediaDest.stream);

  // start the sound/recording
  const startRecording = async () => {
    try {
      recorder.ondataavailable = event => {
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
    const saveBlob: Blob = new Blob(audioChunks, {type: 'audio/ogg'})
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

  const playBackRecording = async (): Promise<void> => {
    if (!audioChunks.length || !audioContext) {
      console.error('Something went wrong', audioChunks.length === 0, !audioContext);
      return;
    }
    const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' })
    const arrayBuffer = await audioBlob.arrayBuffer()
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null')
          return
        }
        audioBuffer.current = audioContext.createBufferSource()
        audioBuffer.current.buffer = buffer
        audioBuffer.current.connect(finalDest)

        audioBuffer.current.onended = () => {
          setIsPlaying(false)
        }
        audioBuffer.current.start()
        setIsPlaying(true)
      },
      (error) => {
        console.error('error playing audio: ', error)
      }
    ).catch((playError) => {
      console.error('error playing: ', playError)
    })
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
        <button onClick={playBackRecording}>Playback</button>
      </div>
      {/* <div>
        <AudioTag source={audioSource} />
      </div> */}
    </div>
  );
};

export default RecordSynth;