import React, { useState, useRef } from 'react';

interface Props {
  oscSettings: {
    frequency: number,
    detune: number,
    type: string
  };
  changeType: (e: any) => void;
  changeValue: (e: any) => void;
}

const Oscillator = ({oscSettings, changeType, changeValue}: Props): React.JSX.Element => {
  const { type, frequency, detune } = oscSettings;

  return (
    <div className="text-center">
      <h4 className="text-center">Oscillator</h4>
      <div className="oscOptions">
        <button className="btn" id="sine" onClick={changeType}>Sine</button>
        <button className="btn" id="triangle" onClick={changeType}>Triangle</button>
        <button className="btn" id="square" onClick={changeType}>Square</button>
        <button className="btn" id="sawtooth" onClick={changeType}>Sawtooth</button>
      </div>
      <div className="oscFreq">
        <div className="slider">
          <div className="knob"></div>
        </div>
        <input value={frequency} max="880" onChange={changeValue} id="frequency" type="range" />
      </div>
      <div className="oscDetune">
        <input value={detune} max="150" min="-150" onChange={changeValue} id="detune" type="range" />
      </div>
    </div>
  );
};

export default Oscillator;