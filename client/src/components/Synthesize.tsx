import React, { useState } from 'react';
import SynthDaw from './synthComponents/SynthDaw';
import { useLoaderData } from 'react-router-dom';

interface Props {
  audioContext: AudioContext
}

const Synthesize = ({audioContext}: Props): React.JSX.Element => {
  // setting up basic audioContext workflow => w/ oscillatorNode
  const user: any = useLoaderData();
  const userId = user.id
  console.log('USER', user.id);
  const oscillator: OscillatorNode = audioContext.createOscillator();
  const filter: BiquadFilterNode = audioContext.createBiquadFilter();
  const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const finalDest: AudioDestinationNode = audioContext.destination;

  // connect the workflow of audioNodes
  oscillator.connect(filter);
  filter.connect(finalDest);
  filter.connect(mediaDest);

  return (
    <div>
      <SynthDaw audioContext={audioContext} oscillator={oscillator} filter={filter} mediaDest={mediaDest} finalDest={finalDest} userId={userId} />
    </div>
  );
};

export default Synthesize;