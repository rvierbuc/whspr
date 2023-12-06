import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';

interface Props {
  audioContext: AudioContext
}

const Synthesize = ({audioContext}: Props): React.JSX.Element => {

  // setting up basic audioContext workflow => w/ oscillatorNode
  const oscillator: OscillatorNode = audioContext.createOscillator();
  const filter: BiquadFilterNode = audioContext.createBiquadFilter();
  const destination: AudioDestinationNode = audioContext.destination;

  // connect the workflow of audioNodes
  oscillator.connect(filter);
  filter.connect(destination);

  return (
    <div>
      <NavBar />
      <h1>Synthesize Component</h1>
      <SynthDaw audioContext={audioContext} oscillator={oscillator} filter={filter} />
    </div>
  );
};

export default Synthesize;