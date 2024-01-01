import React, { useState, useEffect, BaseSyntheticEvent } from 'react';
import { Container, Stack } from 'react-bootstrap';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';
import Filters from './Filters';
import PostSynth from './PostSynth';
import * as Tone from 'tone';

interface Props {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
  mediaDest: MediaStreamAudioDestinationNode
}

const defaultSettings = {
  lowPassFrequency: 350,
  highPassFrequency: 350,
  highPassType: 'highpass',
  lowPassType: 'lowpass',
}

const SynthDaw = ({audioContext, oscillator, mediaDest}: Props): React.JSX.Element => {
  const [contextState, setContextState] = useState('');
  const [addFilter, setAddFilter ] = useState(false);
  const [addSynth, setAddSynth ] = useState(false);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [filter, setFilter] = useState(defaultSettings);
  const [instrument, setInstrument] = useState<Tone.Synth | null>(null);

  const inst = new Tone.FatOscillator(330, 'sine').toDestination();
  // console.log('INSTRUMENT', inst.frequency.value);

  useEffect(() => {
    setAddFilter(false);
    setAddSynth(false);
  }, []);

  // conditional rendering of filters and synth
  const toggleFilter: () => void = () => addFilter === false ? setAddFilter(true) : setAddFilter(false);
  const toggleSynth: () => void = () => addSynth === false ? setAddSynth(true) : setAddSynth(false);

  const [oscSettings, setOscSettings] = useState({
    frequency: inst.frequency.value,
    detune: inst.detune.value,
    type: inst.type,
  });

  const start: () => void = () => {
    if (contextState === '') {
      inst.start();
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  const stop: () => void = () => {
    inst.stop()
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

  const changeType: (e: BaseSyntheticEvent) => void = (e) => {
    const { id } = e.target;
    setOscSettings({ ...oscSettings, type: id });
    inst.type = id;
  };

  const changeValue: (e: BaseSyntheticEvent) => void = (e) => {
    const value: number = e.target.value;
    const id: string = e.target.id;
    setOscSettings({ ...oscSettings, [id]: Number(value) });
    if (id === 'frequency') {
      inst.frequency.value = Number(value);
    } else if (id === 'detune') {
      inst.detune.value = Number(value);
    }
  };

  return (
    <Container className="w-75 rounded text-white text-center">
      <PostSynth filter={filter} audioContext={audioContext} synthAudioChunks={synthAudioChunks} />
      <Stack className="w-50 mx-auto rounded" style={ { display: 'd-flex', justifyContent: 'center' } }>
        <div>
          <button type="button" className="btn synthRecorder text-white" style={ { margin: '15px', width: '25%' } } onClick={toggleFilter}>Filters</button>
          <button type="button" className="btn synthRecorder text-white" style={ { margin: '15px', width: '25%' } } onClick={toggleSynth}>Synth</button>
        </div>
      </Stack>
      <Stack direction="vertical">
        {addFilter === true && <Filters setFilter={setFilter} audioContext={audioContext} />}
        <Container className="syntheSize rounded mt-3" style={{border: '1px solid rgba(236, 210, 210, 0.36)'}}>
          {addSynth === true && <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />}
          {addSynth === true && <RecordSynth setIsRecording={setIsRecording} setSynthAudioChunks={setSynthAudioChunks} stop={stop} start={start} mediaDest={mediaDest} />}
        </Container>
      </Stack>
    </Container>
  );
};

export default SynthDaw;