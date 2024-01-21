import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import { Stack, Button } from 'react-bootstrap';
import * as Tone from 'tone';
import { SlQuestion } from "react-icons/sl";

interface Props {
  oscSettings: {
    frequency: Tone.Unit.Frequency,
    detune: number,
    type: string
  };
  changeType: (e: BaseSyntheticEvent) => void;
  changeValue: (e: BaseSyntheticEvent) => void;
  phaserSettings: {
    phaseFrequency: Tone.Unit.Frequency | undefined,
    Q: number | undefined
    octaves: number | undefined
    phaseWet: number | undefined
  }
  distortionSettings: {
    distortion: number | undefined
    wet: number | undefined
  }
  changePhase: (e: BaseSyntheticEvent) => void
  changeDistortion: (e: BaseSyntheticEvent) => void
  setInstrument: any
  oscillatorOptions: {
    oscillator: Tone.Oscillator
    fatOscillator: Tone.FatOscillator
    fmOscillator: Tone.FMOscillator
    amOscillator: Tone.AMOscillator
  }
  start: () => void;
  stop: () => void;
  synthBypass: {
    phaseFilter: boolean
    distortionFilter: boolean
  }
  audioContext: AudioContext
  synthFilters: {
    phaseFilter: Tone.Phaser;
    distortionFilter: Tone.Distortion;
  }
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
  handleInfoToggle: (event: BaseSyntheticEvent) => void
}

const Oscillator = ({
  start,
  stop,
  oscSettings,
  changeType,
  changeValue,
  setInstrument,
  oscillatorOptions,
  changeDistortion,
  changePhase,
  distortionSettings,
  synthBypass,
  phaserSettings,
  audioContext,
  synthFilters,
  handleInfoToggle,
  instrument }: Props): React.JSX.Element => {

  const oscillatorKeys = Object.keys(oscillatorOptions).map(option => option = option[0].toUpperCase() + option.substring(1));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { oscillator, fatOscillator, fmOscillator, amOscillator } = oscillatorOptions
  const { type, frequency, detune } = oscSettings;
  const { Q, octaves } = phaserSettings;
  const { wet, distortion } = distortionSettings;
  const [selectedOscillator, setSelectedOscillator] = useState<string>(oscillatorKeys[0]);
  const gainNode: Tone.Gain = new Tone.Gain();
  gainNode.gain.value = -1;

  useEffect(() => {
    setSelectedOscillator(oscillatorKeys[0]);
  }, []);

  const handleTypeChange: (event: BaseSyntheticEvent) => void = (event) => {
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

  const hearSynth: () => void = () => {
    const filters: any[] = Object.values(synthFilters);
    Tone.start();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (!synthBypass.phaseFilter) {
      synthFilters.phaseFilter.wet.value = 0;
    } else {
      synthFilters.phaseFilter.wet.value = 0.5
    }
    if (!synthBypass.distortionFilter) {
      synthFilters.distortionFilter.wet.value = 0;
    } else {
      synthFilters.distortionFilter.wet.value = 0.5;
    }
    instrument.volume.value = -2;
    gainNode.gain.value = -1;
    const compressor: Tone.Compressor = new Tone.Compressor();
    instrument.connect(compressor);
    compressor.connect(filters[0]);
    filters[0].connect(filters[1]);
    filters[1].connect(gainNode);
    instrument.start();
    gainNode.gain.rampTo(1, 0.3);
  };

  return (
    <div className="oscillator card">
        <Stack direction="vertical" gap={3} className="mx-auto mb-1">
          {/* oscillator types */}
          <div className="text-center text-white oscillatorOptions">
            <h4 className="text-center mb-2">Oscillator Type <SlQuestion id="oscType" onClick={handleInfoToggle} /></h4>
            <Button id="oscillatorType" className={`btn mx-1  ${selectedOscillator === oscillatorKeys[0] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(oscillator)}>Default</Button>
            <Button id="oscillatorType" className={`btn mx-1 ${selectedOscillator === oscillatorKeys[1] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(fatOscillator)} >Fat</Button>
            <Button id="oscillatorType" className={`btn mx-1 ${selectedOscillator === oscillatorKeys[2] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(fmOscillator)} >FM</Button>
            <Button id="oscillatorType" className={`btn mx-1 ${selectedOscillator === oscillatorKeys[3] && 'activeButton'}`} variant='dark' onClick={() => handleOscillatorChange(amOscillator)} >AM</Button>
          </div>
          {/* wave types */}
          <div className="text-center text-white mx-auto">
            <h4 className="text-center mb-2">Wave Type <SlQuestion id="waveType" onClick={handleInfoToggle} /></h4>
            <Button className={`btn mx-1 ${type === 'sine' && 'activeButton'}`} variant='dark' id="sine" onClick={(e) => handleTypeChange(e)}>Sine</Button>
            <Button className={`btn mx-1 ${type === 'triangle' && 'activeButton'}`} variant='dark' id="triangle" onClick={(e) => handleTypeChange(e)} >Triangle</Button>
            <Button className={`btn mx-1 ${type === 'square' && 'activeButton'}`} variant='dark' id="square" onClick={(e) => handleTypeChange(e)} >Square</Button>
            <Button className={`btn mx-1 ${type === 'sawtooth' && 'activeButton'}`} variant='dark' id="sawtooth" onClick={(e) => handleTypeChange(e)} >Sawtooth</Button>
          </div>
          {/* frequency/detune and synth filters below */}
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white mr-1">
                <h6>Frequency</h6>
                <input value={frequency} max="660" onChange={changeValue} id="frequency" type="range" />
              </div>
              <div className="text-center text-white ml-1">
                <h6>Detune</h6>
                <input value={detune} max="150" min="-150" onChange={changeValue} id="detune" type="range" />
              </div>
            </Stack>
          </div>
          {/* PHASER OPTIONS */}
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
            <div style={{ display: 'inline-block', justifyContent: 'center', marginLeft: '1.3em' }}>
              <Button
                className={`btn-sm btn-dark ${synthBypass.phaseFilter && 'activeButton'}`}
                style={{display: 'inline-block', marginLeft: '1.7rem' }}
                id='phaseFilter'
                disabled={isPlaying}
                onClick={changePhase}>Phaser</Button>
            </div>
            <h5 className="text-white" style={{display: 'inline-block', marginLeft: '0.5rem'}}><SlQuestion id="phaser" onClick={handleInfoToggle} /></h5>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Spread</h6>
                <input
                  value={Q}
                  max="20"
                  min="0"
                  onChange={changePhase}
                  disabled={!synthBypass.phaseFilter}
                  id="Q"
                  type="range"
                  step={0.05}/>
              </div>
              <div className="text-center text-white">
                <h6>Octaves</h6>
                <input
                  value={octaves}
                  max="10"
                  min="0.5"
                  onChange={changePhase}
                  disabled={!synthBypass.phaseFilter}
                  id="octaves"
                  type="range"
                  step={0.05}/>
              </div>
            </Stack>
          </div>
          {/* DISTORTION OPTIONS */}
          <div className="mx-auto" style={{marginBottom: '-1rem'}}>
            <div style={{ display: 'inline-block', justifyContent: 'center', marginLeft: '1.3rem' }}>
              <Button
                className={`btn-sm btn-dark ${synthBypass.distortionFilter && 'activeButton'}`}
                style={{ display: 'inline-block', marginLeft: '1.7rem' }}
                id='distortionFilter'
                disabled={isPlaying}
                onClick={changeDistortion}
                >Distortion</Button>
            </div>
            <h5 className="text-white" style={{display: 'inline-block', marginLeft: '0.5rem'}}><SlQuestion id="distortion" onClick={handleInfoToggle} /></h5>
          </div>
          <div className="mx-auto" style={{display: 'flex', justifyContent: 'center'}}>
            <Stack direction="horizontal" gap={5}>
              <div className="text-center text-white">
                <h6>Distortion</h6>
                <input
                  value={distortion}
                  max="1"
                  min="0"
                  onChange={changeDistortion}
                  disabled={!synthBypass.distortionFilter}
                  id="distort"
                  type="range"
                  step={0.05}/>
              </div>
              <div className="text-center text-white">
                <h6>Dry/Wet</h6>
                <input
                  value={wet}
                  max="1"
                  min="0"
                  onChange={changeDistortion}
                  disabled={!synthBypass.distortionFilter}
                  id="wet"
                  type="range"
                  step={0.05}/>
              </div>
            </Stack>
          </div>
        </Stack>
        <div className="text-center p-3 rounded recordSynth">
          <button
            type="button"
            className="btn btn-dark"
            style={{ minHeight: '4.5vh'}}
            onClick={() => {
              if (isPlaying) {
                gainNode.gain.rampTo(-2, 0.3);
                setIsPlaying(false);
                stop();
              } else {
                setIsPlaying(true);
                hearSynth();
              }
            }}
          >Hear your synth</button>
        </div>
    </div>
  );
};

export default Oscillator;