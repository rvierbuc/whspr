import React, { useState, useEffect, BaseSyntheticEvent } from 'react';
import { Container, Stack } from 'react-bootstrap';
import Oscillator from './Oscillator';
import { RecordPost }from '../RecordPost';
import Filters from './Filters';
import PostCard from '../PostCard';
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
  phaseFilter: Tone.Phaser
  user: any
}

const defaultSettings = {
  lowPassFrequency: 350,
  highPassFrequency: 350,
  highPassType: 'highpass',
  lowPassType: 'lowpass',
}

const SynthDaw = ({ audioContext, oscillatorOptions, user }: Props): React.JSX.Element => {
  const [addSynth, setAddSynth ] = useState(false);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [filter, setFilter] = useState(defaultSettings);
  const [instrument, setInstrument] = useState(oscillatorOptions.oscillator);
  const [postCategories, setPostCategories] = useState<string[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');

  useEffect(() => {
    setAddSynth(false);
    setInstrument(oscillatorOptions.oscillator)
  }, []);

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

  // top to bottom layout
  /**
   * inputs => check
   * filters => check
   * synth => check
   * recordpost => check
   */
  return (
    <Container className="w-75 rounded text-white text-center">
      <PostCard setPostCategories={setPostCategories} setPostTitle={setPostTitle} />
      <Filters setFilter={setFilter} audioContext={audioContext} />
      <Stack className="w-50 mx-auto rounded" style={ { display: 'd-flex', justifyContent: 'center' } }>
        <div>
          <button type="button" className="btn btn-dark text-white" style={ { margin: '15px', width: '25%' } } onClick={toggleSynth}>Synth</button>
        </div>
      </Stack>
      <Stack direction="vertical">
        {addSynth === true &&
          <Container className="syntheSize rounded mt-3">
            <Oscillator setSynthAudioChunks={setSynthAudioChunks} stop={stop} start={start} instrument={instrument} oscillatorOptions={oscillatorOptions} setInstrument={setInstrument} oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
          </Container>}
      </Stack>
      <RecordPost
        user={user}
        filter={filter}
        audioContext={audioContext}
        title={postTitle}
        categories={postCategories}
        synthAudioChunks={synthAudioChunks}
      />
    </Container>
  );
};

export default SynthDaw;