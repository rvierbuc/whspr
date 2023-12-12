import React, { useRef, useState } from 'react';

/**
 * Step 1: Set up getUserMedia (or whatever is needed to record voice)
 * Step 2: Then pass that through effects nodes
 * Step 3: Then pass the node whose output I want to record into recorder.js
 * Step 4: Then save to the cloud
 */


/**
 * record audio => grab audio => run through effects nodes
 */

interface Props {
  audioContext: AudioContext;
  userId: number
}

const SynthVoice = ({ audioContext, userId }: Props) => {
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audio = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      
    } catch (error) {
      console.error(error);
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
        delay.delayTime.value = 0.7;
        const distortion = audioContext.createWaveShaper();
        distortion.oversample = '2x';
        audio.current = audioContext.createBufferSource()
        audio.current.buffer = buffer
        audio.current.connect(delay);
        delay.connect(distortion);
        distortion.connect(audioContext.destination);

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

  return (
    <div>
      <h2 className="text-white text-center">SynthVoice</h2>
    </div>
  );
};

export default SynthVoice;