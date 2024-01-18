import React, { useEffect, useState, useRef } from 'react';
import Visualiser from './Visualiser';

const AudioAnalyser = ({ audioContext }) => {
  const [audioData, setAudioData] = useState([]);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(new Uint8Array());
  const [rafId, setRafId] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const execute = async () => {
      try {
        const tick = () => {
          analyser.getByteTimeDomainData(dataArray);
          setAudioData([...dataArray]); // Use spread to create a new array
          setRafId(requestAnimationFrame(tick));
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

        const analyser = audioContext.createAnalyser();
        setAnalyser(analyser);
        const dataArray = new Uint8Array(analyser.fftSize);
        const audio = audioContext.createMediaStreamSource(stream);
        audio.connect(analyser);
        setRafId(requestAnimationFrame(tick));

        return () => {
          cancelAnimationFrame(rafId);
          analyser.disconnect();
          audio.disconnect();
        };
      } catch (error) {
        console.log('Error:', error);
      }
    };

    execute();
  }, [audioContext]);

  return <Visualiser audioData={audioData} />;
};

export default AudioAnalyser;

