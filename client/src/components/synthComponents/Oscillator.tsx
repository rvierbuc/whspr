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
    phaseRate: number
    phaseDepth: number
    phaseFeedback: number
    phaseStereoPhase: number
    phaseBaseModulationFrequency: number
    phaseBypass: boolean
  }
  tremoloSettings: {
    tremoloIntensity: number
    tremoloRate: number
    tremoloStereoPhase: number
    tremoloBypass: boolean
  }
  changePhase: (e: BaseSyntheticEvent) => void
  changeTremolo: (e: BaseSyntheticEvent) => void
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
  changeTremolo,
  changePhase,
  tremoloSettings,
  phaserSettings }: Props): React.JSX.Element => {

  const oscillatorKeys = Object.keys(oscillatorOptions).map(option => option = option[0].toUpperCase() + option.substring(1));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { oscillator, fatOscillator, fmOscillator, amOscillator } = oscillatorOptions
  const { type, frequency, detune } = oscSettings;
  const { phaseRate, phaseDepth, phaseBypass} = phaserSettings;
  const { tremoloRate, tremoloIntensity, tremoloBypass } = tremoloSettings;
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
              className={`btn-sm btn-dark ${phaseBypass === true && 'activeButton'}`}
              style={{display: 'flex', justifyContent: 'center'}}
              id='phaseBypass'
              onClick={(e) => changePhase(e)}>Phaser</Button>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Rate</h6>
                <input value={phaseRate} max="8" min="0.01" onChange={changePhase} id="phaseRate" type="range" step={0.05} />
              </div>
              <div className="text-center text-white">
                <h6>Depth</h6>
                <input value={phaseDepth} max="1" min="0" onChange={changePhase} id="phaseDepth" type="range" step={0.005} />
              </div>
            </Stack>
          </div>
          {/* TREMOLO OPTIONS */}
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
            <Button
              className={`btn-sm btn-dark ${tremoloBypass === true && 'activeButton'}`}
              style={{ display: 'flex', justifyContent: 'center' }}
              id='tremoloBypass'
              onClick={changeTremolo}
              >Tremolo</Button>
          </div>
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Rate</h6>
                <input value={tremoloRate} max="8" min="0.001" onChange={changeTremolo} id="tremoloRate" type="range" step={0.05} />
              </div>
              <div className="text-center text-white">
                <h6>Intensity</h6>
                <input value={tremoloIntensity} max="1" min="0" onChange={changeTremolo} id="tremoloIntensity" type="range" step={0.005} />
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