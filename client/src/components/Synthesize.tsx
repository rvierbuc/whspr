import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';

const Synthesize = (props: {audioContext: AudioContext}) => {
  const context: AudioContext = props.audioContext

  return (
    <div>
      <NavBar />
      <h1>Synthesize Component</h1>
      <SynthDaw audioContext={context} />
    </div>
  );
};

export default Synthesize;