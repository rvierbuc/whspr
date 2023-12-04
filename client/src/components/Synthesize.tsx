import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';

const Synthesize = (props: {audioContext: BaseAudioContext}) => {
  const context: BaseAudioContext = props.audioContext;
  console.log('Synthesize', context);

  return (
    <div>
      <NavBar />
      <h1>Synthesize Component</h1>
      <SynthDaw audioContext={context} />
    </div>
  );
};

export default Synthesize;