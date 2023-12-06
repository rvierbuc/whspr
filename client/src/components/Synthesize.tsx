import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';
import RecordSynth from './synthComponents/RecordSynth';

interface Props {
  audioContext: AudioContext
}

const Synthesize = ({audioContext}: Props): React.JSX.Element => {
  // setting up basic audioContext workflow => w/ oscillatorNode
  const oscillator: OscillatorNode = audioContext.createOscillator();
  const filter: BiquadFilterNode = audioContext.createBiquadFilter();
  const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const finalDest: AudioDestinationNode = audioContext.destination;

  // connect the workflow of audioNodes
  oscillator.connect(filter);
  filter.connect(finalDest)
  filter.connect(mediaDest);

  return (
    <div>
      <NavBar />
      <h1>Synthesize Component</h1>
      <SynthDaw audioContext={audioContext} oscillator={oscillator} filter={filter} mediaDest={mediaDest} />
    </div>
  );
};

export default Synthesize;