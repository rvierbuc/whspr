import React from 'react';
import Tuna from 'tunajs';
import SynthVoice from './SynthVoice';

interface Props {
  audioContext: AudioContext
  userId: any
}

const Filters = ({ audioContext, userId }: Props) => {
  const tuna = new Tuna(audioContext);
  console.log('TUNATUNA', tuna);

  const robot = () => {

  };
  return (
    <div>
      <h2>Filters here</h2>
    </div>
  );
};

export default Filters;