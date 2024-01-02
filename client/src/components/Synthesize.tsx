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

const Synthesize = ({ audioContext }: Props): React.JSX.Element => {

  const oscillatorOptions: Options = {
    oscillator: new Tone.Oscillator().toDestination(),
    fatOscillator: new Tone.FatOscillator().toDestination(),
    fmOscillator: new Tone.FMOscillator().toDestination(),
    amOscillator: new Tone.AMOscillator().toDestination()
  }

  return (
    <Container className="p-3 rounded w-75" id="synthesize">
      <div>
        <SynthDaw audioContext={audioContext} oscillatorOptions={oscillatorOptions} />
      </div>
    </Container>
  );
};

export default Synthesize;