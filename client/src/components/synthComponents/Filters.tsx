import React, { useState } from 'react';
import Tuna from 'tunajs';
import { Stack, Button, Container } from 'react-bootstrap';

interface Props {
  audioContext: AudioContext
  setFilter: any
  filter: any
}

const Filters = ({ setFilter, audioContext, filter }: Props) => {
  const [currentFilter, setCurrentFilter] = useState<string>('defaultSettings')
  const tuna = new Tuna(audioContext);

  const handleFilterChange = (filter: any) => {
    setFilter(filter);
    if (filter === defaultSettings) {
      setCurrentFilter('defaultSettings');
    } else if (filter === alien) {
      setCurrentFilter('alien');
    } else if (filter === wobbly) {
      setCurrentFilter('wobbly');
    } else if (filter === robot) {
      setCurrentFilter('robot');
    } else if (filter === sixteenBit) {
      setCurrentFilter('sixteenBit');
    }
  };

  const defaultSettings = {
    lowPassFrequency: 350,
    highPassFrequency: 350,
    highPassType: 'highpass',
    lowPassType: 'lowpass',
  }

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
      bypass: false,
    }),
    gain: new tuna.Gain({ gain: 90 }),
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
      bypass: false,
    }),
    pingPongDelay: new tuna.PingPongDelay({
      wetLevel: 0.6,
      feedback: 0.7,
      delayTimeLeft: 60,
      delayTimeRight: 100,
    }),
    gain: new tuna.Gain({ gain: 850})
  };

  const alien = {
    lowPassType: 'lowpass',
    lowPassFrequency: 50,
    highPassType: 'highpass',
    highPassFrequency: 7000,
    gain: new tuna.Gain({ gain: 600 }),
    compressor: new tuna.Compressor({
      threshold: -80,
      makeupGain: 20,
      attack: 1,
      release: 250,
      ratio: 4,
      knee: 5,
      automakeup: false,
      bypass: false,
    }),
    phaser: new tuna.Phaser({
      rate: 23,
      depth: 0.4,
      feedback: 0.6,
      stereoPhase: 20,
      baseModulationFrequency: 1000,
      bypass: false,
    }),
  };

  const sixteenBit = {
    lowPassType: 'lowpass',
    lowPassFrequency: 150,
    highPassType: 'highpass',
    highPassFrequency: 8500,
    gain: new tuna.Gain({ gain: 30000 }), // no higher than 30000
    wah: new tuna.Bitcrusher({
      bits: 16,          //1 to 16
      normfreq: 0.15,    //0 to 1
      bufferSize: 4096  //256 to 16384
    }),
    tremolo: new tuna.MoogFilter({
      cutoff: 0.9,    //0 to 1
      resonance: 3.5,   //0 to 4
      bufferSize: 4096 //256 to 16384
    }),
  };

  return (
    <Container className="text-center my-2 rounded" style={{ flexDirection: 'row', justifyContent: 'center' }}>
    <div id="synthFilters">
      <div id="synthFilters" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <h5 className="text-white mb-2" style={{ fontFamily: 'headerFont' }}>Try out one of our filters</h5>
      </div>
      <div>
        <Button style={{margin: '1rem'}} id="filterBtn" className={`btn text-white ${currentFilter === 'defaultSettings' && 'activeButton'}`}variant='dark' onClick={() => handleFilterChange(defaultSettings)}>None</Button>
        <Button style={{margin: '1rem'}} id="filterBtn" className={`btn text-white ${currentFilter === 'alien' && 'activeButton'}`} variant='dark' onClick={() => handleFilterChange(alien)}>Alien</Button>
        <Button style={{margin: '1rem'}} id="filterBtn" className={`btn text-white ${currentFilter === 'wobbly' && 'activeButton'}`} variant='dark' onClick={() => handleFilterChange(wobbly)}>Wobbly</Button>
        <Button style={{margin: '1rem'}} id="filterBtn" className={`btn text-white ${currentFilter === 'robot' && 'activeButton'}`} variant='dark' onClick={() => handleFilterChange(robot)}>Robot</Button>
        <Button style={{margin: '1rem'}} id="filterBtn" className={`btn text-white ${currentFilter === 'sixteenBit' && 'activeButton'}`} variant='dark' onClick={() => handleFilterChange(sixteenBit)}>16-bit</Button>
      </div>
    </div>
  </Container>
  );
};

export default Filters;