import React from 'react';
import SynthDaw from './synthComponents/SynthDaw';
import { Container } from 'react-bootstrap'


interface Props {
  audioContext: AudioContext
}

/**
 * TODO:
 *
 * 2) Expand the synth if you have issues combining voice and synth => let users experiment with wave manipulation so they can post their experiments
 */

const Synthesize = ({ audioContext }: Props): React.JSX.Element => {
  const oscillator: OscillatorNode = audioContext.createOscillator();
  const finalFilter: BiquadFilterNode = audioContext.createBiquadFilter();
  const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const finalDest: AudioDestinationNode = audioContext.destination;

  return (
    <Container className="p-3 rounded w-75" id="synthesize">
      <div>
        <SynthDaw audioContext={audioContext} oscillator={oscillator} mediaDest={mediaDest} />
      </div>
    </Container>
  );
};

export default Synthesize;