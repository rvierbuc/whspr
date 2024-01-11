import React from 'react';
import SynthDaw from './synthComponents/SynthDaw';
import { Container } from 'react-bootstrap';
import * as Tone from 'tone';
import { useLoaderData } from 'react-router-dom';
import * as Tone from 'tone';
import Tuna from 'tunajs';


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
  const user: any = useLoaderData();
  const tuna = new Tuna(audioContext);

  const oscillatorOptions: Options = {
    oscillator: new Tone.Oscillator().toDestination(),
    fatOscillator: new Tone.FatOscillator().toDestination(),
    fmOscillator: new Tone.FMOscillator().toDestination(),
    amOscillator: new Tone.AMOscillator().toDestination()
  }

  const phaseFilter: Tone.Phaser = new Tone.Phaser({
    frequency: 15,
    Q: 10,
    octaves: 4,
    wet: 0.5
  }).toDestination();

  const bitCrushFilter: Tone.BitCrusher = new Tone.BitCrusher().toDestination();
  bitCrushFilter.bits.value = 5.5;
  bitCrushFilter.wet.value = 0.5;

  return (
    <Container className="p-3 rounded w-75">
      <div>
        <SynthDaw bitCrushFilter={bitCrushFilter} phaseFilter={phaseFilter} user={user} audioContext={audioContext} oscillatorOptions={oscillatorOptions} />
      </div>
    </Container>
  );
};

export default Synthesize;