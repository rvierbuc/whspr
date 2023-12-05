import React, { useState, useRef } from 'react';
import * as Tone from 'tone';

interface Props {
  oscillator: OscillatorNode
}

const Oscillator = ({oscillator}: Props): React.JSX.Element => {
  const { type, frequency } = oscillator;

  // set the type state
  const [osc, setOsc] = useState({
    frequency: oscillator.frequency.value,
    detune: oscillator.detune.value,
    type: oscillator.type
  });

  // change the type value
  const changeType: (e: any) => void = (e) => {
    let id: any = e.target?.id;
    setOsc({...osc, type: id});
    osc.type = id;
  };

  const changeValue: (e: any) => void = (e) => {
    let { value, id } = e.target;
    setOsc({...osc, [id]: value})
    osc[id].value = value;
  };

  // return dynamic html
  return (
    <div>
      <h4>Oscillator</h4>
      <div className="oscOptions">
        <button id="sine" onClick={changeType}>Sine</button>
        <button id="triangle" onClick={changeType} className="waveOption">Triangle</button>
        <button id="square" onClick={changeType} className="waveOption">Square</button>
        <button id="sawtooth" onClick={changeType} className="waveOption">Sawtooth</button>
      </div>
      <div className="oscFreq">
        <input value={(osc.frequency)} onChange={changeValue} id="frequency" type="range" />
      </div>
      <div className="oscDetune">
        <input id="detune" type="range" />
      </div>
    </div>
  );
};

export default Oscillator;