import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import Oscillator from './Oscillator';

const SynthDaw = (props: { audioContext: AudioContext}): React.JSX.Element => {
  // set context to prop's audioContext
  const context: AudioContext = props.audioContext;

  // oscillator node set to the prop's osc
  const oscillator: OscillatorNode = context.createOscillator();
  const destination: AudioDestinationNode = context.destination;
  oscillator.connect(destination);

  // setting base context's state
  const [contextState, setContextState] = useState('');
  // setting Oscillator's state => should be able to render when an older post is fetched
  const [oscSettings, setOscSettings] = useState(oscillator);

  // basic controller function
  const controller: () => void = () => {
    if (contextState === '') {
      oscillator.start();
      setContextState('started');
    } else if (context.state === 'suspended') {
      context.resume();
    } else if (context.state === 'running') {
      context.suspend();
    }
  };

  // returning the dynamic html
  return (
    <div>
      <h3>This is the Daw!</h3>
      <button onClick={() => controller()}>Play</button>
      <button onClick={() => controller()}>Stop</button>
      <Oscillator oscillator={oscSettings} />
    </div>
  );
}

export default SynthDaw;