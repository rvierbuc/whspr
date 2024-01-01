import React, { useRef } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import * as Tone from 'tone';

interface Props {
  start: () => void;
  stop: () => void;
  setSynthAudioChunks: any
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
}

const RecordSynth = ({ instrument, setSynthAudioChunks, start, stop }: Props) => {
  const context = Tone.context;
  const dest = context.createMediaStreamDestination();
  const recorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      setSynthAudioChunks([]);
      instrument.connect(dest);
      recorder.current = new MediaRecorder(dest.stream);
      recorder.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setSynthAudioChunks((prevChunks: Blob[]) => [...prevChunks, event.data])
        }
      };
      recorder.current.start();
      start();
      // setIsRecording(true);
    } catch(error) {
      console.error('Could not start recording', error)
    }
  };
  const stopRecording = async () => {
    try {
      if (recorder.current?.state === 'recording') {
        stop();
        recorder.current.stop();
        // setIsRecording(false);
      }
    } catch (error) {
      console.error('Could not stop recording', error);
    }
  };

  return (
    <Container className="text-center p-3 rounded recordSynth">
      <h3 className="mb-2">Record the synth</h3>
      <Stack direction="horizontal" gap={4} className="mx-5 typeCard">
        <Button className="btn synthRecorder" style={{borderColor: 'rgb(60, 53, 86)'}} onClick={start}>▶️</Button>
        <Button className="btn synthRecorder" style={{borderColor: 'rgb(60, 53, 86)'}} onClick={stop}>⏸️</Button>
        <Button className="btn synthRecorder" style={{borderColor: 'rgb(60, 53, 86)'}} onClick={startRecording}>🔴</Button>
        <Button className="btn synthRecorder" style={{borderColor: 'rgb(60, 53, 86)'}} onClick={stopRecording}>🟥</Button>
      </Stack>
    </Container>
  );
};

export default RecordSynth;