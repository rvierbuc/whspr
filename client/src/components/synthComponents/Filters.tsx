import React from 'react';
import Tuna from 'tunajs';
import SynthVoice from './SynthVoice';

interface Props {
  audioContext: AudioContext
  userId: any
}

/**
 * make each filter an object => pass into SynthVoice => add the filter as an optional parameter? => need a default no filter?
 * 
 * maybe use Object.values(filter).forEach() or normal loop?
 * set only up to 5 audioNodes per filter?
 *  OR just 3 and have lowPass and highPass in SynthVoice (results may not be great for other filters)
 */

const Filters = ({ audioContext, userId }: Props) => {
  const tuna = new Tuna(audioContext); // this is working

  // lowpass/highpass types/values
  const robot = {
    lowPassType: 'lowpass',
    lowPassFrequency: 60,
    highPassType: 'highpass',
    highPassFrequency: 5000,
    chorus: new tuna.Chorus({
      rate: 5,
      feedback: 0.45,
      delay: 0.6,
      bypass: false,
    }),
    compressor: new tuna.Compressor({
      threshold: -100,
      makeupGain: 7,
      attack: 5,
      release: 500,
      ratio: 9,
      knee: 36,
      automakeup: false,
      bypass: false
    }),
    gain: new tuna.Gain({ gain: 90 })
  };

  const wobbly = {
    lowPassType: 'lowpass',
    lowPassFrequency: 150,
    highPassType: 'highpass',
    highPassFrequency: 6000,
    wahwah: new tuna.WahWah({
      automode: true,
      baseFrequency: 0.2,
      excursionOctaves: 6,
      sweep: 0.35,
      resonance: 36,
      sensitivity: -0.3,
      bypass: false
    }),
    pingPongDelay: new tuna.PingPongDelay({
      wetLevel: 0.6,
      feedback: 0.7,
      delayTimeLeft: 60,
      delayTimeRight: 100,
    }),
    gain: new tuna.Gain({ gain: 250})
  }

  return (
    <div>
      <h2>Filters here</h2>
      <SynthVoice audioContext={audioContext} userId={userId} robot={robot} wobbly={wobbly} />
    </div>
  );
};

export default Filters;