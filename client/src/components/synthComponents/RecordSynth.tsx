import React, { useState, useRef } from 'react';
import { Container, Button, Stack, Card } from 'react-bootstrap';

interface Props {
  mediaDest: MediaStreamAudioDestinationNode;
  start: () => void;
  stop: () => void;
  setSynthAudioChunks: any
  setIsRecording: any
}

const RecordSynth = ({ setIsRecording, setSynthAudioChunks, mediaDest, start, stop }: Props) => {
  const recorder = useRef<MediaRecorder | null>(null);
  const startRecording = async () => {
    try {
      recorder.current = new MediaRecorder(mediaDest.stream);
      recorder.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setSynthAudioChunks((prevChunks: Blob[]) => [...prevChunks, event.data])
        }
      };
      recorder.current.start();
      start();
      setIsRecording(true);
    } catch(error) {
      console.error('Could not start recording', error)
    }
  };
  const stopRecording = async () => {
    try {
      if (recorder.current?.state === 'recording') {
        stop();
        recorder.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Could not stop recording', error);
    }
  };

  return (
    <Container className="text-center p-3 rounded recordSynth">
      <h3 className="mb-2">Record the synth</h3>
      <Stack direction="horizontal" gap={4} className="mx-5 typeCard">
        <Button className="btn synthRecorder" onClick={start}>▶️</Button>
        <Button className="btn synthRecorder" onClick={stop}>⏸️</Button>
        <Button className="btn synthRecorder" onClick={startRecording}>🔴</Button>
        <Button className="btn synthRecorder" onClick={stopRecording}>🟥</Button>
      </Stack>
    </Container>
  );
};

export default RecordSynth;