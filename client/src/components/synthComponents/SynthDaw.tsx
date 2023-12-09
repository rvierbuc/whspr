import React, { useState, useEffect, MouseEventHandler, SyntheticEvent } from 'react';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';

interface Props {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
  filter: BiquadFilterNode
  mediaDest: MediaStreamAudioDestinationNode
  finalDest: AudioDestinationNode
}

const SynthDaw = ({audioContext, finalDest, oscillator, mediaDest, filter}: Props): React.JSX.Element => {
  // setting base context's state
  const [contextState, setContextState] = useState('');

  // oscillator's settings
  const [oscSettings, setOscSettings] = useState({
    frequency: oscillator.frequency.value,
    detune: oscillator.detune.value,
    type: oscillator.type
  });

  // start the audio
  const start: () => void = () => {
    if (contextState === '') {
      oscillator.start();
      setContextState('started');
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  // stop the audio
  const stop: () => void = () => {
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

  // change the type value => not working
  const changeType: (e: any) => void = (e) => {
    let { id } = e.target;
    setOscSettings({...oscSettings, type: id});
    oscillator.type = id;
  };

  // change the frequency values => not working
  const changeValue = (e: any) => {
    let value: number = e.target.value;
    let id: string = e.target.id;
    setOscSettings({...oscSettings, [id]: Number(value)})
    if (id === 'frequency') {
      oscillator.frequency.value = Number(value);
    } else if (id === 'detune') {
      oscillator.detune.value = Number(value);
    }
  };

  return (
    <div className="card w-50 p-4">
      <h3 className="text-center">This is the Daw!</h3>
      <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
      <RecordSynth audioContext={audioContext} stop={stop} start={start} mediaDest={mediaDest} finalDest={finalDest} />
    </div>
  );
}

export default SynthDaw;