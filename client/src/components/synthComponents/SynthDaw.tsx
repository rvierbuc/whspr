import React, { useState, useEffect } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';
import Filters from './Filters';
import PostSynth from './PostSynth';

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
  const [title, setTitle] = useState('');
  const [addFilter, setAddFilter ] = useState(false);
  const [addSynth, setAddSynth ] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  console.log('SynthDaw', isRecording);

  useEffect(() => {
    setAddFilter(false);
    setAddSynth(false);
  }, [])

  const toggleFilter = () => {
    addFilter === false ? setAddFilter(true) : setAddFilter(false);
  };

  const toggleSynth = () => {
    addSynth === false ? setAddSynth(true) : setAddSynth(false);
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
    <Container className="w-50 rounded text-white text-center">
      <PostSynth isRecording={isRecording} synthAudioChunks={synthAudioChunks} audioChunks={audioChunks} userId={userId} />
      <button type="button" className="btn btn-dark" style={{margin:'15px', width: '25%'}} onClick={toggleFilter}>Make a post</button>
      <button type="button" className="btn btn-dark" style={{margin:'15px', width: '25%'}} onClick={toggleSynth}>Add a synth</button>
      <Stack>
        {addFilter === true && <Filters synthAudioChunks={synthAudioChunks} isRecording={isRecording} setIsRecording={setIsRecording} setAudioChunks={setAudioChunks} title={title} audioContext={audioContext} />}
        {addSynth === true && <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />}
        {addSynth === true && <RecordSynth setIsRecording={setIsRecording} setSynthAudioChunks={setSynthAudioChunks} stop={stop} start={start} mediaDest={mediaDest} />}
      </Stack>
    </Container>
  );
}

export default SynthDaw;