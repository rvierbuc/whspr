import React, { useState, useRef } from 'react';
import * as Tone from 'tone';

interface Props {
  oscSettings: {
    frequency: OscillatorNode['frequency']['value'],
    detune: OscillatorNode['detune']['value'],
    type: OscillatorType
  };
  changeType: (e: any) => void;
  changeValue: (e: any) => void;
}

const Oscillator = ({oscSettings, changeType, changeValue}: Props): React.JSX.Element => {
  const { type, frequency } = oscSettings;

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
        <input value={frequency} onChange={changeValue} id="frequency" type="range" />
      </div>
      <div className="oscDetune">
        <input id="detune" type="range" />
      </div>
    </div>
  );
};

export default Oscillator;