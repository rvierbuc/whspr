import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import * as Tone from 'tone';

interface Props {
  oscSettings: {
    frequency: Tone.Unit.Frequency,
    detune: number,
    type: string
  };
  changeType: (e: BaseSyntheticEvent) => void;
  changeValue: (e: BaseSyntheticEvent) => void;
  phaserSettings: {
    phaseFrequency: Tone.Unit.Frequency,
    Q: number
    octaves: number
    phaseWet: number
  }
  bitCrushSettings: {
    bitWet: number
    bits: number
  }
  changePhase: (e: BaseSyntheticEvent) => void
  changeBitCrusher: (e: BaseSyntheticEvent) => void
  setInstrument: any
  oscillatorOptions: {
    oscillator: Tone.Oscillator
    fatOscillator: Tone.FatOscillator
    fmOscillator: Tone.FMOscillator
    amOscillator: Tone.AMOscillator
  }
  start: () => void;
  stop: () => void;
}

const Oscillator = ({
  start,
  stop,
  oscSettings,
  changeType,
  changeValue,
  setInstrument,
  oscillatorOptions,
  changeBitCrusher,
  changePhase,
  bitCrushSettings,
  phaserSettings }: Props): React.JSX.Element => {

  const oscillatorKeys = Object.keys(oscillatorOptions).map(option => option = option[0].toUpperCase() + option.substring(1));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { oscillator, fatOscillator, fmOscillator, amOscillator } = oscillatorOptions
  const { type, frequency, detune } = oscSettings;
  const { Q, phaseFrequency, phaseWet } = phaserSettings;
  const { bits, bitWet } = bitCrushSettings;
  const [phaseBypass, setPhaseBypass] = useState<boolean>(true);
  const [bitBypass, setBitBypass] = useState<boolean>(true);
  const [selectedWave, setSelectedWave] = useState('Select Wave');
  const [selectedOscillator, setSelectedOscillator] = useState<string>(oscillatorKeys[0]);

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
    <div className="oscillator card">
        <Stack direction="vertical" gap={3} className="mx-auto mb-1">
          {/* oscillator types */}
          <div className="text-center text-white oscillatorOptions">
            <h5 className="text-center mb-2">Oscillator Type</h5>
            <Button className={`btn mx-1  ${selectedOscillator === oscillatorKeys[0] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(oscillator)}>Default</Button>
            <Button className={`btn mx-1 ${selectedOscillator === oscillatorKeys[1] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(fatOscillator)} >Fat</Button>
            <Button className={`btn mx-1 ${selectedOscillator === oscillatorKeys[2] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(fmOscillator)} >FM</Button>
            <Button className={`btn mx-1 ${selectedOscillator === oscillatorKeys[3] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(amOscillator)} >AM</Button>
          </div>
          {/* wave types */}
          <div className="text-center text-white mx-auto">
            <h5 className="text-center mb-2">Wave Type</h5>
            <Button className={`btn mx-1 ${type === 'sine' && 'activeButton'}`} variant='dark' id="sine" onClick={(e) => handleTypeChange(e)}>Sine</Button>
            <Button className={`btn mx-1 ${type === 'triangle' && 'activeButton'}`} variant='dark' id="triangle" onClick={(e) => handleTypeChange(e)} >Triangle</Button>
            <Button className={`btn mx-1 ${type === 'square' && 'activeButton'}`} variant='dark' id="square" onClick={(e) => handleTypeChange(e)} >Square</Button>
            <Button className={`btn mx-1 ${type === 'sawtooth' && 'activeButton'}`} variant='dark' id="sawtooth" onClick={(e) => handleTypeChange(e)} >Sawtooth</Button>
          </div>
          {/* frequency/detune and synth filters below */}
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Frequency</h6>
                <input value={frequency} max="880" onChange={changeValue} id="frequency" type="range" />
              </div>
              <div className="text-center text-white">
                <h6>Detune</h6>
                <input value={detune} max="150" min="-150" onChange={changeValue} id="detune" type="range" />
              </div>
            </Stack>
          </div>
          {/* PHASER OPTIONS */}
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
            <Button
              className={`btn-sm btn-dark ${!phaseBypass && 'activeButton'}`}
              style={{display: 'flex', justifyContent: 'center'}}
              id='phaseFilter'
              onClick={(e) => {
                setPhaseBypass(!phaseBypass);
                changePhase(e)
              }}>Phaser</Button>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Dry/Wet</h6>
                <input value={phaseWet} max="1" min="0" onChange={changePhase} id="phaseWet" type="range" step={0.05} />
              </div>
              <div className="text-center text-white">
                <h6>Quality</h6>
                <input value={Q} max="20" min="0" onChange={changePhase} id="quality" type="range" step={0.05} />
              </div>
            </Stack>
          </div>
          {/* TREMOLO OPTIONS */}
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
            <Button
              className={`btn-sm btn-dark ${!bitBypass && 'activeButton'}`}
              style={{ display: 'flex', justifyContent: 'center' }}
              id='bitCrushFilter'
              onClick={(e) => {
                setBitBypass(!bitBypass);
                changeBitCrusher(e)
              }}
              >Tremolo</Button>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Dry/Wet</h6>
                <input value={bitWet} max="1" min="0" onChange={changeBitCrusher} id="bitWet" type="range" step={0.05} />
              </div>
              <div className="text-center text-white">
                <h6>Bits</h6>
                <input value={bits} max="10" min="1" onChange={changeBitCrusher} id="bits" type="range" step={0.05} />
              </div>
            </Stack>
          </div>
        </Stack>
        <div className="text-center p-3 rounded recordSynth">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
                stop();
              } else {
                setIsPlaying(true);
                start();
              }
            }}
          >Hear your synth</button>
        </div>
    </div>
  );
};

export default Oscillator;