import React, { useRef, useState } from 'react';
import { Stack, Button, Container } from 'react-bootstrap';
import axios from 'axios';

/**
 * record audio => grab audio => run through effects nodes
 */

interface Props {
  audioContext: AudioContext;
  userId: any
}

const SynthVoice = ({ audioContext, userId }: Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audio = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  // start the recording => set the recorder, stream, and the recorder's methods for getting audioChunks
  const startRecording = async () => {
    try {
      setAudioChunks([]);
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      }
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  //stop the recording process
  const stopRecording = async () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // stop mic access => this may not be necessary
      const tracks = mediaRecorder.current.stream.getTracks();
      tracks.forEach(track => track.stop())
    }
  };

  const playAudio = async (): Promise<void> => {
    if ((audioChunks.length === 0) || !audioContext) {
      console.error('something was null: ', audioChunks.length === 0, !audioContext)
      return
    }
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    const arrayBuffer = await audioBlob.arrayBuffer()
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null')
          return
        }
        const delay = audioContext.createDelay()
        delay.delayTime.value = 1;
        const distortion = audioContext.createWaveShaper();
        distortion.oversample = '4x';
        const gain = audioContext.createGain();
        gain.gain.value = -1;
        const filter = audioContext.createBiquadFilter();
        filter.detune.value = -5000;
        audio.current = audioContext.createBufferSource()
        audio.current.buffer = buffer
        audio.current.connect(delay);
        delay.connect(distortion);
        distortion.connect(gain);
        gain.connect(audioContext.destination);

        audio.current.onended = () => {
          setIsPlaying(false)
        }
        audio.current.start()
        setIsPlaying(true)
      },
      (error) => {
        console.error('error playing audio: ', error)
      }
    ).catch((playError) => {
      console.error('error playing: ', playError)
    })
  }

  const filter = audioContext.createBiquadFilter();
  console.log('filter', filter);

  const stopPlaying = () => {
    if (audio.current) {
      audio.current.stop();
      setIsPlaying(false);
    }
  };

  const emptyRecording = () => {
    setAudioChunks([])
  };

  const saveAudioToGoogleCloud = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', 'Testing')
      formData.append('category', 'Goofy Steve')
      const response = await axios.post(`/upload`, formData)
      if (response.status === 200) {
        console.info('Audio save successfully')
      } else {
        console.error('Error saving audio:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving audio:', error)
    }
  }

  return (
    <Container className="text-center my-3 pb-3">
      <h2 className="text-white text-center">SynthVoice</h2>
      <Stack direction="horizontal" className="mx-5 mb-3 typeCard">
      <button
            className="record-button"
            onClick={startRecording}
            disabled={isRecording}
            ><img src={require('../../style/recordbutton.png')} /></button>
            <button
            className="play-button"
            onClick={playAudio}
            disabled={isPlaying || audioChunks.length === 0 }
            ><img src={require('../../style/playbutton.png')} /></button>
            <button
            className="stop-button"
            onClick={isRecording ? stopRecording : stopPlaying}
            disabled={!isRecording && !isPlaying}
            ><img src={require('../../style/stopbutton.png')} /></button>
            <button
            className="delete-button"
            onClick={emptyRecording}
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../../style/deletebutton.png')} /></button>
            <button
            className="post-button"
            onClick={()=>{
              saveAudioToGoogleCloud()}
            }
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../../style/postbutton.png')} /></button>
      </Stack>
    </Container>
  );
};

export default SynthVoice;