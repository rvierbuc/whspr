import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import * as Tone from 'tone';
import RecordSynth from './RecordSynth';

interface Options {
  oscillator: Tone.Oscillator
  fatOscillator: Tone.FatOscillator
  fmOscillator: Tone.FMOscillator
  amOscillator: Tone.AMOscillator
}

interface Props {
  oscSettings: {
    frequency: Tone.Unit.Frequency,
    detune: number,
    type: string
  };
  changeType: (e: BaseSyntheticEvent) => void;
  changeValue: (e: BaseSyntheticEvent) => void;
  setInstrument: any
  oscillatorOptions: Options
  start: () => void;
  stop: () => void;
  setSynthAudioChunks: any
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
}

const Oscillator = ({ start, stop, setSynthAudioChunks, instrument, oscSettings, changeType, changeValue, setInstrument, oscillatorOptions }: Props): React.JSX.Element => {
  const oscillatorKeys = Object.keys(oscillatorOptions).map(option => option = option[0].toUpperCase() + option.substring(1));

  const { oscillator, fatOscillator, fmOscillator, amOscillator } = oscillatorOptions
  const { type, frequency, detune } = oscSettings;
  const [selectedWave, setSelectedWave] = useState('Select Wave');
  const [selectedOscillator, setSelectedOscillator] = useState<string>(oscillatorKeys[0]);
  console.log(type);

  useEffect(() => {
    setSelectedWave(type[0].toUpperCase() + type.substring(1))
    setSelectedOscillator(oscillatorKeys[0]);
  }, [])

  const handleTypeChange: (event: BaseSyntheticEvent) => void = (event) => {
    const waveId = event.target.id;
    setSelectedWave(waveId[0].toUpperCase() + waveId.substring(1));
    changeType(event)
  };

  const handleOscillatorChange: (oscOption: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator) => void = (oscOption) => {
    setInstrument(oscOption);
    if (oscOption === oscillator) {
      setSelectedOscillator(oscillatorKeys[0]);
    } else if (oscOption === fatOscillator) {
      setSelectedOscillator(oscillatorKeys[1]);
    } else if (oscOption === fmOscillator) {
      setSelectedOscillator(oscillatorKeys[2]);
    } else if (oscOption === amOscillator) {
      setSelectedOscillator(oscillatorKeys[3]);
    }
  };

  return (
    <Container className="oscillator">
        <Stack direction="horizontal" gap={4} className="mx-5 mb-3 typeCard">
          <div className="mr-3">
            <h5 className="text-center mb-3">Oscillator Type</h5>
            <Stack direction="vertical" gap={3}>
              <Button className="btn" id="sine" variant={selectedOscillator === oscillatorKeys[0] ? 'danger' : 'dark'} onClick={() => handleOscillatorChange(oscillator)}>{oscillatorKeys[0]}</Button>
              <Button className="btn" id="triangle" variant={selectedOscillator === oscillatorKeys[1] ? 'danger' : 'dark'} onClick={() => handleOscillatorChange(fatOscillator)} >{oscillatorKeys[1]}</Button>
              <Button className="btn" id="square" variant={selectedOscillator === oscillatorKeys[2] ? 'danger' : 'dark'} onClick={() => handleOscillatorChange(fmOscillator)} >{oscillatorKeys[2]}</Button>
              <Button className="btn" id="sawtooth" variant={selectedOscillator === oscillatorKeys[3] ? 'danger' : 'dark'} onClick={() => handleOscillatorChange(amOscillator)} >{oscillatorKeys[3]}</Button>
            </Stack>
          </div>
          <div>
            <Stack direction="vertical" gap={5}>
              <Stack direction="horizontal" className="typeCard mb-2">
                <div className="text-center">
                  <h6>Frequency</h6>
                  <input value={frequency} max="880" onChange={changeValue} id="frequency" type="range" />
                </div>
                <div className="text-center">
                  <h6>Detune</h6>
                  <input value={detune} max="150" min="-150" onChange={changeValue} id="detune" type="range" />
                </div>
              </Stack>
              <RecordSynth instrument={instrument} setSynthAudioChunks={setSynthAudioChunks} stop={stop} start={start} />
            </Stack>
          </div>
          <div className="ml-2">
            <h5 className="text-center mb-3">Wave Type</h5>
            <Stack direction="vertical" gap={3}>
              <Button className="btn" variant={type === 'sine' ? 'danger' : 'dark'} id="sine" onClick={(e) => handleTypeChange(e)}>Sine</Button>
              <Button className="btn" variant={type === 'triangle' ? 'danger' : 'dark'} id="triangle" onClick={(e) => handleTypeChange(e)} >Triangle</Button>
              <Button className="btn" variant={type === 'square' ? 'danger' : 'dark'} id="square" onClick={(e) => handleTypeChange(e)} >Square</Button>
              <Button className="btn" variant={type === 'sawtooth' ? 'danger' : 'dark'} id="sawtooth" onClick={(e) => handleTypeChange(e)} >Sawtooth</Button>
            </Stack>
          </div>
        </Stack>
    </Container>
  );
};

export default Oscillator;