import React, { useEffect, useState } from 'react';
import Visualiser from './Visualiser';

interface AudioAnalyserProps {
  audioContext: AudioContext;
  audioStream?: MediaStream;
}

const AudioAnalyser: React.FC<AudioAnalyserProps> = ({ audioContext }) => {
  const [audioStream, setAudioStream] = useState<MediaStream>()
  const [audioData, setAudioData] = useState<number[]>([]);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [rafId, setRafId] = useState<number | null>(null);

  useEffect(() => {
    const execute = async () => {
      try {
        if (!audioStream) {
          console.log('Audio stream is undefined');
        const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setAudioStream(audioStream)
          return;
        }


        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        setAnalyser(analyser);

        const dataArray = new Uint8Array(analyser.fftSize);
        const audio = audioContext.createMediaStreamSource(audioStream);
        audio.connect(analyser);

        const tick = () => {
          analyser.getByteTimeDomainData(dataArray);
          setAudioData([...dataArray]);
          setRafId(requestAnimationFrame(tick));
        };

        setRafId(requestAnimationFrame(tick));

        return () => {
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          analyser.disconnect();
          audio.disconnect();
        };
      } catch (error) {
        console.log('Error:', error);
      }
    };

    execute();
  }, [audioContext, audioStream]);

  return <Visualiser audioData={audioData} />;
};

export default AudioAnalyser;

