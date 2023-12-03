import React from 'react';
import NavBar from './NavBar';

const Synthesize = (props: any) => {
  console.log(props.audioContext);
  return (
    <div>
      <NavBar />
      <h1>Synthesize</h1>
    </div>
  );
};

export default Synthesize;