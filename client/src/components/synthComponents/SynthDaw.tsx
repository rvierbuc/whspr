import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';
import SynthVoice from './SynthVoice';
import * as Tone from 'tone';


interface Props {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
  filter: BiquadFilterNode
  mediaDest: MediaStreamAudioDestinationNode
  finalDest: AudioDestinationNode
  userId: number
}

const SynthDaw = ({audioContext, finalDest, oscillator, mediaDest, filter, userId}: Props): React.JSX.Element => {
  const [contextState, setContextState] = useState('');
  const [title, setTitle] = useState('')

  useEffect(() => {
    setTitle('')
  }, []);

  const handleEdit = (e: any) => {
    setTitle(e.target.value);
  };

  const [oscSettings, setOscSettings] = useState({
    frequency: oscillator.frequency.value,
    detune: oscillator.detune.value,
    type: oscillator.type
  });

  const start: () => void = () => {
    if (contextState === '') {
      oscillator.start();
      setContextState('started');
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  const stop: () => void = () => {
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

  const changeType: (e: any) => void = (e) => {
    let { id } = e.target;
    setOscSettings({...oscSettings, type: id});
    oscillator.type = id;
  };

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
    <Container className="synthCont w-50 rounded text-white text-center">
      <div>
        <h3 className="text-center">Set the Tone</h3>
        <input className="mb-2" type="text" value={title} onChange={handleEdit} />
        <SynthVoice title={title} audioContext={audioContext} userId={userId} />
        <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
        <RecordSynth title={title} audioContext={audioContext} stop={stop} start={start} mediaDest={mediaDest} finalDest={finalDest} userId={userId} />
      </div>
    </Container>
  );
}

export default SynthDaw;