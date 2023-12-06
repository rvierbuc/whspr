import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import Oscillator from './Oscillator';

interface Props {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
  filter: BiquadFilterNode
}

const SynthDaw = ({audioContext, oscillator, filter}: Props): React.JSX.Element => {

  // setting base context's state
  const [contextState, setContextState] = useState('');
  // setting Oscillator's state => should be able to render when an older post is fetched
  const [oscSettings, setOscSettings] = useState({
    frequency: 200,
    detune: oscillator.detune.value,
    type: oscillator.type
  });

  // start the audio
  const start: () => void = () => {
    if (contextState === '') {
      oscillator.start();
      setContextState('started');
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  // stop the audio
  const stop: () => void = () => {
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

    // change the type value
    const changeType: (e: any) => void = (e) => {
      let { id } = e.target;
      setOscSettings({...oscSettings, type: id});
      oscSettings.type = id;
    };

    const changeValue: (e: any) => void = (e) => {
      let value: OscillatorNode['frequency']['value'] = e.target.value;
      setOscSettings({...oscSettings, frequency: value})
      oscSettings.frequency['value'] = value;
    };

  return (
    <div>
      <h3>This is the Daw!</h3>
      <button onClick={() => start()}>Play</button>
      <button onClick={() => stop()}>Stop</button>
      <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
    </div>
  );
}

export default SynthDaw;