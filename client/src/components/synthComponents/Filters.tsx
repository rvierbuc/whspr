import React from 'react';
import { Container } from 'react-bootstrap';

interface Props {
  audioContext: AudioContext
}

const Filters = ({ audioContext }: Props) => {
  const distortion = () => {

  };

  return (
    <Container className="text-center">
      <h2>Filters go here</h2>
    </Container>
  );
};

export default Filters;