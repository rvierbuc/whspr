import React, { useState, useRef } from 'react';

interface Props {
  audioContext: AudioContext;
  mediaDest: MediaStreamAudioDestinationNode;
  start: () => void;
  stop: () => void;
}

const RecordSynth = ({ audioContext, mediaDest, start, stop }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioSource, setAudioSource] = useState('');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // setup the media recorder
  const recorder: MediaRecorder = new MediaRecorder(mediaDest.stream);
  recorder.ondataavailable = event => setAudioChunks((prevChunks) => [...prevChunks, event.data]);
  recorder.onstop = event => {
    let blob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus'});
    setAudioSource(URL.createObjectURL(blob));
    console.log(audioSource);
  };

  console.log(recorder);

  // start the sound/recording
  const startRecording = () => {
    start();
    setIsRecording(true);
    recorder.start()
  };

  // stop the sound/recording
  const stopRecording = () => {
    stop();
    setIsRecording(false);
    recorder.stop()
  };


  return (
    <div>
      <h3>Record the synth</h3>
      <div>
        <button onClick={start}>Play</button>
        <button onClick={stop}>Stop</button>
        <button onClick={startRecording}>Record</button>
        <button onClick={stopRecording}>Stop Record</button>
      </div>
      <audio id="recording" src={audioSource} controls>
          Your browser does not support this feature
        </audio>
    </div>
  );
};

export default RecordSynth;