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
  const [title, setTitle] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSource, setAudioSource] = useState<string>('');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioBuffer = useRef<AudioBufferSourceNode | null>(null);
  const recorder: MediaRecorder = new MediaRecorder(mediaDest.stream);
  const userId: number = 5;
  const category: string = 'music';

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
  console.log(audioSource);
  // stop the sound/recording
  const stopRecording = async () => {
    try {
      stop();
      recorder.stop();
      recorder.onstop = async () => {
        let blob: string = URL.createObjectURL(new Blob(audioChunks, {type: 'audio/wav'}));
        setAudioSource(blob.slice(5));
      };
      console.log('in stopRecording', audioSource);
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
      console.log('cloud response', response)
      response.status === 200 ? console.log('Synth saved to cloud') : console.error('Error saving synth', response.statusText)
    } catch(error) {
      console.error('Error saving audio', error);
    }
  };

  const postRecording = async () => {
    try {
      const soundUrl = await saveRecording();
      console.log(soundUrl);
      const postResponse = await axios.post('/createPostRecord', {
        userId: userId,
        title: 'My music',
        category: 'music',
        soundURL: soundUrl
      })
      if (postResponse.status === 200) {
        console.log('Post saved to Database')
        await saveRecording()
      } else {
        console.error('Error saving post: ', postResponse.statusText)
      }
    } catch (error) {
      console.error('error saving post: ', error)
    }
  }

  return (
    <div className="text-center">
      <h3>Record the synth</h3>
      <div>
        <button className="btn" onClick={start}>Play</button>
        <button className="btn" onClick={stop}>Stop</button>
        <button className="btn" onClick={startRecording}>Record</button>
        <button className="btn" onClick={stopRecording}>Stop Record</button>
        <button className="btn" onClick={postRecording}>Post</button>
      </div>
      <div>
        {/* <AudioTag source={audioSource} /> */}
      </div>
    </div>
  );
};

export default RecordSynth;