import React, { useEffect, useState, useRef } from 'react';
import Visualiser from './Visualiser';

const AudioAnalyser  = ({audioContext, stream}) => {
  
    const [audioData, setAdudioData] = useState<any>( new Uint8Array)
    const [analyser, setAnalyser] = useState<any>(null)
    const [dataArray, setDataArray] = useState<any>(null)
    const [rafId, setRafId] = useState<any>(null)
    const source = audioContext.createMediaStreamSource(stream)
  

  useEffect  (() => {
    setAnalyser(audioContext.createAnalyser());
    setDataArray(new Uint8Array(analyser.frequencyBinCount))
    source.connect(analyser);
    setRafId(requestAnimationFrame(tick));
    return () => {
        cancelAnimationFrame(rafId);
        analyser.disconnect();
        source.disconnect();

      }
  }, [])

  const tick = () => {
    analyser.getByteTimeDomainData(dataArray);
    setAdudioData(dataArray);
    setRafId(requestAnimationFrame(tick));
  }

  

    return( 
    <Visualiser audioData={audioData} />
    );
  
}

export default AudioAnalyser;
