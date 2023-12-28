import React, { useState } from 'react';
import SynthDaw from './synthComponents/SynthDaw';
import { useLoaderData } from 'react-router-dom';
import { Container } from 'react-bootstrap'


interface Props {
  audioContext: AudioContext
}

/**
 * TODO:
 *
 * 1) Pass around the filters and set them from synthesize to pass into post synth so options can be dynamically chosen and functionality kept in appropriate containers
 * 2) Expand the synth if you have issues combining voice and synth => let users experiment with wave manipulation so they can post their experiments
 * 3) Get thoughts from Caity about your styling and see what you can do to improve (don't be afraid of feedback)
 * 4) Wait to pull Daniel's profile edit to add your functional delete logic
 * 5) Get the hashtags into Synthesize to delete hardcoded hashtags
 * 6) Double check the mobile landscape as well => see that it makes sense
 * 7) Redirect back to profile or homepage after posting
 */

const Synthesize = ({ audioContext }: Props): React.JSX.Element => {
  // setting up basic audioContext workflow => w/ oscillatorNode
  const user: any = useLoaderData();
  const userId = user.id;
  const oscillator: OscillatorNode = audioContext.createOscillator();
  const finalFilter: BiquadFilterNode = audioContext.createBiquadFilter();
  const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
  const finalDest: AudioDestinationNode = audioContext.destination;

  // connect the workflow of audioNodes
  oscillator.connect(finalFilter);
  finalFilter.connect(finalDest);
  finalFilter.connect(mediaDest);

  return (
    <Container className="p-3 rounded w-75" id="synthesize">
      <div>
        <SynthDaw audioContext={audioContext} oscillator={oscillator} mediaDest={mediaDest} userId={userId} />
      </div>
    </Container>
  );
};

export default Synthesize;