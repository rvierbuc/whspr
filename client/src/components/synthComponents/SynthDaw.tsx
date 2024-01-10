import React, { useState, useEffect, BaseSyntheticEvent } from 'react';
import { Container } from 'react-bootstrap';
import Oscillator from './Oscillator';
import { RecordPost } from '../RecordPost';
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
};

const SynthDaw = ({ audioContext, oscillatorOptions, user, phaseFilter }: Props): React.JSX.Element => {
  const [addSynth, setAddSynth ] = useState(false);
  const [synthAudioChunks, setSynthAudioChunks] = useState<Blob[]>([]);
  const [filter, setFilter] = useState(defaultSettings);
  const [instrument, setInstrument] = useState(oscillatorOptions.oscillator);
  const [postCategories, setPostCategories] = useState<string[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');

  useEffect(() => {
    setAddSynth(false);
    setInstrument(oscillatorOptions.oscillator);
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
    instrument.stop();
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
    <Container className="rounded text-white text-center" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '-1rem' }}>
      <div className="card p-3">
        <div className="p-2 mb-1">
          <PostCard setPostCategories={setPostCategories} setPostTitle={setPostTitle} />
          <Filters filter={filter} setFilter={setFilter} audioContext={audioContext} />
        </div>
        <div className="synthOption">
          <button type="button" className="text-white btn btn-dark btn-rounded" style={ { margin: '0.1rem', width: '50%' } } onClick={toggleSynth}>Synthesize your own sound!</button>
        </div>
        {addSynth === true &&
        <Container className="syntheSize rounded mt-3">
          <Oscillator
            setSynthAudioChunks={setSynthAudioChunks}
            stop={stop}
            start={start}
            instrument={instrument}
            oscillatorOptions={oscillatorOptions}
            setInstrument={setInstrument}
            oscSettings={oscSettings}
            changeType={changeType}
            changeValue={changeValue} />
        </Container>}
        <RecordPost
          addSynth={addSynth}
          user={user}
          filter={filter}
          audioContext={audioContext}
          title={postTitle}
          categories={postCategories}
          instrument={instrument}
          start={start}
          stop={stop}
        />
      </div>
    </Container>
  );
};

export default SynthDaw;