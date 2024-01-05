import React, { useRef, useState } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import * as Tone from 'tone';

interface Props {
  start: () => void;
  stop: () => void;
  setSynthAudioChunks: any
  instrument: Tone.Oscillator | Tone.FatOscillator | Tone.FMOscillator | Tone.AMOscillator
}

const RecordSynth = ({ instrument, setSynthAudioChunks, start, stop }: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
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
      {(isPlaying || isRecording) ? (<button
          type="button"
          className="btn btn-danger btn-lg"
          id="play-btn"
          style={{marginRight: '6px'}}
          onClick={() => {
            setIsPlaying(false);
            stop();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="red"
            className="bi bi-stop-fill"
            viewBox="0 0 16 16"
          >
            <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-light btn-lg"
          style={{marginRight: '6px'}}
          id="play-btn"
          onClick={() => {
            setIsPlaying(true);
            start();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="blue"
            className="bi bi-play-fill"
            viewBox="0 0 16 16"
          >
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
          </svg>
        </button>)}
        <Button className="btn btn-light btn-lg" style={{borderColor: 'rgb(60, 53, 86)'}} disabled={isRecording} onClick={startRecording}>🔴</Button>
        <Button className="btn btn-light btn-lg" style={{borderColor: 'rgb(60, 53, 86)'}} disabled={!isRecording} onClick={stopRecording}>🟥</Button>
      </Stack>
    </Container>
  );
};

export default RecordSynth;