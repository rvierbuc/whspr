import React from 'react';
import SynthDaw from './synthComponents/SynthDaw';
import { Container } from 'react-bootstrap';
import * as Tone from 'tone';


interface Props {
  audioContext: AudioContext
}

interface Options {
  oscillator: Tone.Oscillator
  fatOscillator: Tone.FatOscillator
  fmOscillator: Tone.FMOscillator
  amOscillator: Tone.AMOscillator
}

/**
 * TODO:
 *
 * 2) Expand the synth if you have issues combining voice and synth => let users experiment with wave manipulation so they can post their experiments
 */

const Synthesize = ({ audioContext }: Props): React.JSX.Element => {
  const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const oscillatorOptions: Options = {
    oscillator: new Tone.Oscillator().toDestination(),
    fatOscillator: new Tone.FatOscillator().toDestination(),
    fmOscillator: new Tone.FMOscillator().toDestination(),
    amOscillator: new Tone.AMOscillator().toDestination()
  }
  // // oscillator option 1
  // const oscillator: Tone.Oscillator = new Tone.Oscillator().toDestination();
  // // oscillator option 2
  // const fatOscillator: Tone.FatOscillator = new Tone.FatOscillator().toDestination();
  // // oscillator option 3
  // const fmOscillator: Tone.FMOscillator = new Tone.FMOscillator().toDestination();
  // // oscillator option 4
  // const amOscillator: Tone.AMOscillator = new Tone.AMOscillator().toDestination();

  return (
    <Container className="p-3 rounded w-75" id="synthesize">
      <div>
        <SynthDaw audioContext={audioContext} mediaDest={mediaDest} oscillatorOptions={oscillatorOptions} />
      </div>
    </Container>
  );
};

export default Synthesize;