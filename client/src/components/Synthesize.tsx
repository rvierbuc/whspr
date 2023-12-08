import React from 'react';
import NavBar from './NavBar';

const Synthesize = (props: {audioContext: BaseAudioContext}) => {
  const context: BaseAudioContext = props.audioContext;
  console.log(context);

  return (
    <div>
      <NavBar />
      <h1>Synthesize</h1>
    </div>
  );
};

export default Synthesize;