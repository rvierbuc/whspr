import React from 'react';
import * as Tone from 'tone';

const SynthDaw = (props: {audioContext: BaseAudioContext}) => {
  const context: BaseAudioContext = props.audioContext;
  console.log('SynthDaw', context)
  return (
    <div>
      <h3>This is the Daw!</h3>
    </div>
  );
};

export default SynthDaw;