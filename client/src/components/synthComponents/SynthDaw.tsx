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
  bitCrushFilter: Tone.BitCrusher
  user: any
}

const defaultSettings = {
  lowPassFrequency: 350,
  highPassFrequency: 350,
  highPassType: 'highpass',
  lowPassType: 'lowpass',
};

const SynthDaw = ({ audioContext, oscillatorOptions, user, phaseFilter, bitCrushFilter }: Props): React.JSX.Element => {
  const [addSynth, setAddSynth ] = useState(false);
  const [filter, setFilter] = useState(defaultSettings);
  const [instrument, setInstrument] = useState(oscillatorOptions.oscillator);
  const [postCategories, setPostCategories] = useState<string[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');
  const [synthFilters, setSynthFilters] = useState<{}>({phaseFilter, bitCrushFilter});
  const [oscSettings, setOscSettings] = useState({
    frequency: instrument.frequency.value,
    detune: instrument.detune.value,
    type: instrument.type,
  });
  const [phaserSettings, setPhaserSettings] = useState({
    phaseFrequency: phaseFilter.frequency.value,
    Q: phaseFilter.Q.value,
    octaves: phaseFilter.octaves,
    phaseWet: phaseFilter.wet.value
  });

  const [bitCrushSettings, setBitCrushSettings] = useState({
    bits: bitCrushFilter.bits.value,
    bitWet: bitCrushFilter.wet.value,
  });

  useEffect(() => {
    setAddSynth(false);
    setInstrument(oscillatorOptions.oscillator);
  }, []);

  const toggleSynth: () => void = () => addSynth === false ? setAddSynth(true) : setAddSynth(false);


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

  const changePhase: (e: BaseSyntheticEvent) => void = (e) => {
    const value: number = e.target.value;
    const id: string = e.target.id;
    if (id === 'phaseFilter') {
      if (!synthFilters[id]) {
        setSynthFilters(synthFilters[id] = phaseFilter);
      } else {
        setSynthFilters(delete synthFilters[id]);
      }
    } else {
      setPhaserSettings({ ...phaserSettings, [id]: Number(value) });
      if (id === 'frequency') {
        phaseFilter.frequency.value = Number(value);
      } else if (id === 'wet') {
        phaseFilter.wet.value = Number(value);
      }
    }
  };
  console.log(synthFilters);

  const changeBitCrusher: (e: BaseSyntheticEvent) => void = (e) => {
    const value: number = e.target.value;
    const id: string = e.target.id;
    if (id === 'bitCrushFilter') {
      if (!synthFilters[id]) {
        setSynthFilters(synthFilters[id] = bitCrushFilter);
      } else {
        delete synthFilters[id];
      }
    } else {
      setBitCrushSettings({ ...bitCrushSettings, [id]: Number(value) });
      if (id === 'tremoloIntensity') {
        bitCrushFilter.intensity = Number(value);
      } else if (id === 'tremoloRate') {
        bitCrushFilter.rate = Number(value);
      }
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
            stop={stop}
            start={start}
            oscillatorOptions={oscillatorOptions}
            setInstrument={setInstrument}
            oscSettings={oscSettings}
            changeType={changeType}
            changeValue={changeValue}
            changeBitCrusher={changeBitCrusher}
            changePhase={changePhase}
            phaserSettings={phaserSettings}
            bitCrushSettings={bitCrushSettings}
             />
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
          phaseFilter={phaseFilter}
          bitCrushFilter={bitCrushFilter}
        />
      </div>
    </Container>
  );
};

export default SynthDaw;