import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import { Container, Stack, Dropdown } from 'react-bootstrap';
import * as Tone from 'tone';

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
}

const Oscillator = ({ oscSettings, changeType, changeValue, setInstrument, oscillatorOptions }: Props): React.JSX.Element => {
  const oscillatorKeys = Object.keys(oscillatorOptions).map(option => option = option[0].toUpperCase() + option.substring(1));

  const { oscillator, fatOscillator, fmOscillator, amOscillator } = oscillatorOptions
  const { type, frequency, detune } = oscSettings;
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
    <Container className="">
        <Stack direction="horizontal" gap={4} className="mx-5 mb-3 typeCard">
          <div className="mr-2">
            <h5 className="text-center">Oscillator</h5>
            <Dropdown>
              <Dropdown.Toggle style={{backgroundColor: 'rgb(60, 53, 86)', borderColor: 'rgb(60, 53, 86)', minWidth: '25px'}}>
                {selectedOscillator}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item id="sine" onClick={() => handleOscillatorChange(oscillator)}>{oscillatorKeys[0]}</Dropdown.Item>
                <Dropdown.Item id="triangle" onClick={() => handleOscillatorChange(fatOscillator)} >{oscillatorKeys[1]}</Dropdown.Item>
                <Dropdown.Item id="square" onClick={() => handleOscillatorChange(fmOscillator)} >{oscillatorKeys[2]}</Dropdown.Item>
                <Dropdown.Item id="sawtooth" onClick={() => handleOscillatorChange(amOscillator)} >{oscillatorKeys[3]}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="ml-2">
            <h5 className="text-center">Wave Type</h5>
            <Dropdown>
              <Dropdown.Toggle style={{backgroundColor: 'rgb(60, 53, 86)', borderColor: 'rgb(60, 53, 86)'}}>
                {selectedWave}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item id="sine" onClick={(e) => handleTypeChange(e)}>Sine</Dropdown.Item>
                <Dropdown.Item id="triangle" onClick={(e) => handleTypeChange(e)} >Triangle</Dropdown.Item>
                <Dropdown.Item id="square" onClick={(e) => handleTypeChange(e)} >Square</Dropdown.Item>
                <Dropdown.Item id="sawtooth" onClick={(e) => handleTypeChange(e)} >Sawtooth</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Stack>
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
    </Container>
  );
};

export default Oscillator;