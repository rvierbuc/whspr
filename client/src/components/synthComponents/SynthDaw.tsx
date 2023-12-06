import React, { useState, useEffect, MouseEventHandler, SyntheticEvent } from 'react';
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
  // oscillator's settings
  const [oscSettings, setOscSettings] = useState({
    frequency: oscillator.frequency.value,
    detune: oscillator.detune.value,
    type: oscillator.type
  });
  console.log('state', oscSettings)
  console.log('prop', oscillator)

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

    // change the type value => not working
    const changeType: (e: any) => void = (e) => {
      let { id } = e.target;
      setOscSettings({...oscSettings, type: id});
      oscillator.type = id;
    };

    // change the frequency values => not working
    const changeValue = (e: any) => {
      let value: number = e.target.value;
      let id: string = e.target.id;
      setOscSettings({...oscSettings, [id]: Number(value)})
      if (id === 'frequency') {
        oscillator.frequency.value = Number(value);
      } else if (id === 'detune') {
        oscillator.detune.value = Number(value);
      }
      console.log('settings', oscillator)
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