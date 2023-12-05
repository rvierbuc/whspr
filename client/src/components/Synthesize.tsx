import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';

const Synthesize = (props: {audioContext: AudioContext}) => {
  const context: AudioContext = props.audioContext
  // setting up basic audioContext workflow => w/ oscillatorNode
  const oscillator: OscillatorNode = context.createOscillator();
  const destination: AudioDestinationNode = context.destination;
  oscillator.connect(destination);

  return (
    <div>
      <NavBar />
      <h1>Synthesize Component</h1>
      <SynthDaw audioContext={context} />
    </div>
  );
};

export default Synthesize;