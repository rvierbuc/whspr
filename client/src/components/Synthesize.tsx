import React from 'react';
import NavBar from './NavBar';
import SynthDaw from './synthComponents/SynthDaw';
import { Container } from 'react-bootstrap';

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
  filter.connect(finalDest);
  filter.connect(mediaDest);

  return (
    <div>
      <SynthDaw audioContext={audioContext} oscillator={oscillator} filter={filter} mediaDest={mediaDest} finalDest={finalDest} />
    </div>
  );
};

export default Synthesize;