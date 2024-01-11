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
  // const context = Tone.context;
  const tuna = new Tuna(audioContext);

  const oscillatorOptions: Options = {
    oscillator: new Tone.Oscillator().toDestination(),
    fatOscillator: new Tone.FatOscillator().toDestination(),
    fmOscillator: new Tone.FMOscillator().toDestination(),
    amOscillator: new Tone.AMOscillator().toDestination()
  }

  const phaseFilter: Tuna.Phaser = new tuna.Phaser({
    rate: 4,                     //0.01 to 8 is a decent range, but higher values are possible
    depth: 0.5,                    //0 to 1
    feedback: 0.7,                 //0 to 1+
    stereoPhase: 40,               //0 to 180
    baseModulationFrequency: 700,  //500 to 1500
    bypass: false
  });

  const tremoloFilter: Tuna.Tremolo = new tuna.Tremolo({
    intensity: 0.5,    //0 to 1
    rate: 4,           //0.001 to 8
    stereoPhase: 0,    //0 to 180
    bypass: false
  });

  return (
    <Container className="p-3 rounded w-75">
      <div>
        <SynthDaw tremoloFilter={tremoloFilter} phaseFilter={phaseFilter} user={user} audioContext={audioContext} oscillatorOptions={oscillatorOptions} />
      </div>
    </Container>
  );
};

export default Synthesize;