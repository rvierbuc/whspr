import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

function SynthDaw(props: { audioContext: AudioContext; }): React.JSX.Element {
  // setting base context's state
  const [contextState, setContextState] = useState('');

  // setting up basic audioContext workflow
  const context: AudioContext = props.audioContext;
  const oscillator: OscillatorNode = context.createOscillator();
  const destination: AudioDestinationNode = context.destination;
  oscillator.connect(destination);

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
    </div>
  );
}

export default SynthDaw;