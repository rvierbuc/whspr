import React from 'react';
import { Container, Stack } from 'react-bootstrap';
import PostCard from '../PostCard';

interface Props {
  synthAudioChunks: Blob[]
  audioContext: AudioContext
  filter: any
}

const PostSynth = ({ filter, audioContext, synthAudioChunks }: Props) => {

  return (
    <Container className="d-flex justify-content-center my-3 pt-3 rounded w-75">
      <Stack direction="vertical">
        <PostCard audioContext={audioContext} filter={filter} synthAudioChunks={synthAudioChunks} />
      </Stack>
    </Container>
  );
};

export default PostSynth;