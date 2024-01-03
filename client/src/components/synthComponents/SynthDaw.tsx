import React, { useState, useEffect, BaseSyntheticEvent } from 'react';
import { Container, Stack } from 'react-bootstrap';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';
import Filters from './Filters';
import PostSynth from './PostSynth';
import * as Tone from 'tone';

interface Options {
  oscillator: Tone.Oscillator
  fatOscillator: Tone.FatOscillator
  fmOscillator: Tone.FMOscillator
  amOscillator: Tone.AMOscillator
}

interface Props {
  audioContext: AudioContext,
  oscillatorOptions: Options
}

const defaultSettings = {
  lowPassFrequency: 350,
  highPassFrequency: 350,
  highPassType: 'highpass',
  lowPassType: 'lowpass',
}

const SynthDaw = ({ audioContext, oscillatorOptions }: Props): React.JSX.Element => {
  const [addFilter, setAddFilter ] = useState(false);
  const [addSynth, setAddSynth ] = useState(false);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [filter, setFilter] = useState(defaultSettings);
  const [instrument, setInstrument] = useState(oscillatorOptions.oscillator);

  useEffect(() => {
    setAddFilter(false);
    setAddSynth(false);
    setInstrument(oscillatorOptions.oscillator)
  }, []);

  // conditional rendering of filters and synth
  const toggleFilter: () => void = () => addFilter === false ? setAddFilter(true) : setAddFilter(false);
  const toggleSynth: () => void = () => addSynth === false ? setAddSynth(true) : setAddSynth(false);

  const [oscSettings, setOscSettings] = useState({
    frequency: instrument.frequency.value,
    detune: instrument.detune.value,
    type: instrument.type,
  });

  const start: () => void = () => {
    instrument.start();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  const stop: () => void = () => {
    instrument.stop()
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

  const changeType: (e: BaseSyntheticEvent) => void = (e) => {
    const { id } = e.target;
    setOscSettings({ ...oscSettings, type: id });
    instrument.type = id;
  };

  const changeValue: (e: BaseSyntheticEvent) => void = (e) => {
    const value: number = e.target.value;
    const id: string = e.target.id;
    setOscSettings({ ...oscSettings, [id]: Number(value) });
    if (id === 'frequency') {
      instrument.frequency.value = Number(value);
    } else if (id === 'detune') {
      instrument.detune.value = Number(value);
    }
  };

  return (
    <Container className="w-75 rounded text-white text-center">
      <PostSynth filter={filter} audioContext={audioContext} synthAudioChunks={synthAudioChunks} />
      <Stack className="w-50 mx-auto rounded" style={ { display: 'd-flex', justifyContent: 'center' } }>
        <div>
          <button type="button" className="btn btn-dark text-white" style={ { margin: '15px', width: '25%' } } onClick={toggleFilter}>Filters</button>
          <button type="button" className="btn btn-dark text-white" style={ { margin: '15px', width: '25%' } } onClick={toggleSynth}>Synth</button>
        </div>
      </Stack>
      <Stack direction="vertical">
        {addFilter === true && <Filters setFilter={setFilter} audioContext={audioContext} />}
        {addSynth === true &&
          <Container className="syntheSize rounded mt-3" style={{border: '1px solid rgba(236, 210, 210, 0.36)'}}>
            <Oscillator setSynthAudioChunks={setSynthAudioChunks} stop={stop} start={start} instrument={instrument} oscillatorOptions={oscillatorOptions} setInstrument={setInstrument} oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
          </Container>}
      </Stack>
    </Container>
  );
};

export default SynthDaw;