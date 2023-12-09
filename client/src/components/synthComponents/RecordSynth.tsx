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
  console.log(recorder.stream.getAudioTracks());
  // stop the sound/recording
  const stopRecording = async () => {
    try {
      stop();
      recorder.stop();
      recorder.onstop = async () => {
        let blob: string = URL.createObjectURL(new Blob(audioChunks, {type: 'audio/ogg'}));
        console.log(new Blob(audioChunks, {type: 'audio/wav'}))
        setAudioSource(blob.slice(5));
      };
      console.log('in stopRecording', audioSource);
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
      console.log('cloud response', response)
      response.status === 200 ? console.log('Synth saved to cloud') : console.error('Error saving synth', response.statusText)
    } catch(error) {
      console.error('Error saving audio', error);
    }
  };

  // const playBackRecording = async (): Promise<void> => {
  //   if (!audioChunks.length || !audioContext) {
  //     console.error('Something went wrong', audioChunks.length === 0, !audioContext);
  //     return;
  //   }
  //   const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' })
  //   console.log('chunk', audioChunks)
  //   console.log('blob', audioBlob)
  //   const arrayBuffer = await audioBlob.arrayBuffer()

  //   console.log(arrayBuffer);

  //   audioContext.decodeAudioData(
  //     arrayBuffer,
  //     (buffer) => {
  //       if (!audioContext) {
  //         console.error('audio context is null')
  //         return
  //       }
  //       audioBuffer.current = audioContext.createBufferSource()
  //       audioBuffer.current.buffer = buffer
  //       audioBuffer.current.connect(finalDest)

  //       audioBuffer.current.onended = () => {
  //         setIsPlaying(false)
  //       }
  //       audioBuffer.current.start()
  //       setIsPlaying(true)
  //     },
  //     (error) => {
  //       console.error('error playing audio: ', error)
  //     }
  //   ).catch((playError) => {
  //     console.error('error playing: ', playError)
  //   })
  // };

  const postRecording = async () => {
    try {
      const postResponse = await axios.post('/createPostRecord', {
        userId,
        title,
        category,
        audioId: 1
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
    <div>
      <h3>Record the synth</h3>
      <div>
        <button onClick={start}>Play</button>
        <button onClick={stop}>Stop</button>
        <button onClick={startRecording}>Record</button>
        <button onClick={stopRecording}>Stop Record</button>
        <button onClick={saveRecording}>Post</button>
      </div>
      <div>
        {/* <AudioTag source={audioSource} /> */}
      </div>
    </div>
  );
};

export default RecordSynth;