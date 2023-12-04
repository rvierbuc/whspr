import React, { useState, useEffect } from 'react';
import { Synth } from 'tone';

// let createSynth: Synth = new Synth();

const SynthDaw = (props: {audioContext: AudioContext}) => {
  // setting up basic audioContext workflow
  const context: AudioContext = props.audioContext;
  const oscillator: OscillatorNode = context.createOscillator();
  const destination: AudioDestinationNode = context.destination;
  oscillator.connect(destination);

  // basic controller function
  const controller: () => void = () => {
    if (context.state === 'suspended') {
      context.resume();
    } else if (context.state === 'running') {
      context.suspend();
    }
  };

  // returning the dynamic html
  return (
    <div>
      <h3>This is the Daw!</h3>
      <button onClick={() => oscillator.start()}>Play</button>
      <button onClick={() => controller()}>Stop</button>
      <button onClick={() => controller()}>Resume</button>
    </div>
  );
};

export default SynthDaw;