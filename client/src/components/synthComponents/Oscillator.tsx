import React, { useState } from 'react';

const Oscillator = (props: {oscillator: OscillatorNode, changeType: (e: MouseEvent) => void}): React.JSX.Element => {
  // set the type state
  const [type, setType] = useState('sine');
  const [oscillator, setOscillator] = useState(props.oscillator);

  // return dynamic html
  return (
    <div>
      <h4>Oscillator</h4>
      <div className="oscOptions">
        <button id="sine" onClick={() => props.changeType}>Sine</button>
        <button id="triangle" onClick={(e) => props.changeType(e)} className="waveOption">Triangle</button>
        <button id="square" onClick={(e) => props.changeType(e)} className="waveOption">Square</button>
        <button id="sawtooth" onClick={(e) => props.changeType(e)} className="waveOption">Sawtooth</button>
      </div>
      <div className="oscFreq">
        <input id="frequency" type="range" />
      </div>
      <div className="oscDetune">
        <input id="detune" type="range" />
      </div>
    </div>
  );
};

export default Oscillator;