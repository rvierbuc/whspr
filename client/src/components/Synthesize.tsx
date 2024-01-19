import React, { BaseSyntheticEvent, useState, lazy } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import * as Tone from 'tone';
import { useLoaderData } from 'react-router-dom';

const SynthDaw = lazy(() => import('./synthComponents/SynthDaw'));

interface Props {
  audioContext: AudioContext
}

interface Options {
  oscillator: Tone.Oscillator
  fatOscillator: Tone.FatOscillator
  fmOscillator: Tone.FMOscillator
  amOscillator: Tone.AMOscillator
}

interface ModalToggle {
  oscType: boolean
  waveType: boolean
  phaser: boolean
  distortion: boolean
}

const Synthesize = ({ audioContext }: Props): React.JSX.Element => {
  const user = useLoaderData();

  const [toggleInfo, setToggleInfo] = useState<ModalToggle>({
    oscType: false,
    waveType: false,
    phaser: false,
    distortion: false,
  });

  const [toggleModal, setToggleModal] = useState<boolean>(false);

  const handleInfoToggle: (event: BaseSyntheticEvent) => void = (event) => {
    const id: string = event.target.id;
    setToggleInfo({ ...toggleInfo, [id]: !toggleInfo[id] });
    setToggleModal(!toggleModal);
  };

  const oscillatorOptions: Options = {
    oscillator: new Tone.Oscillator().toDestination(),
    fatOscillator: new Tone.FatOscillator().toDestination(),
    fmOscillator: new Tone.FMOscillator().toDestination(),
    amOscillator: new Tone.AMOscillator().toDestination(),
  };
  oscillatorOptions.oscillator.frequency.value = 330;
  oscillatorOptions.fatOscillator.frequency.value = 330;
  oscillatorOptions.fmOscillator.frequency.value = 330;
  oscillatorOptions.amOscillator.frequency.value = 330;

  const phaseFilter: Tone.Phaser = new Tone.Phaser({
    frequency: 15,
    Q: 10,
    octaves: 5.2,
    wet: 1,
  }).toDestination();

  const distortionFilter: Tone.Distortion = new Tone.Distortion().toDestination();
  distortionFilter.wet.value = 0.5;
  distortionFilter.distortion = 0.5;

  return (
    <Container className="p-3 rounded w-75">
      <Modal show={toggleModal} centered className='synthModal'>
        <Modal.Header>
          {toggleInfo.oscType ? <p><strong>Oscillators</strong> are the basic components of a synth sound and we have four types you can choose to play with!</p> : null}
          {toggleInfo.waveType ? <p><strong>Wave Types</strong> are the primary wave forms/shapes that make up the basic ingredients of audio. There are four types of audio waves!</p> : null}
          {toggleInfo.phaser ? <p><strong>Phaser filters</strong> are used to filter audio by creating a series of hills and valleys, aka peaks, in the oscillator frequency and we have two customizable options to play with!</p> : null}
          {toggleInfo.distortion ? <p><strong>Distortion filters</strong> are used to distort the audio waveform from its original form and we have two customizable options to play with!</p> : null}
        </Modal.Header>
        <Modal.Body>
          {/* OSCILLATORS MODAL */}
          {toggleInfo.oscType ?
          <div>
            <ul>
              <li><em>Default</em>: Unfiltered base-level oscillator that produces a pure tone or frequency.</li>
              <li><em>Fat</em>: Contains a bass heavy oscillator with a rich mid-range frequency.</li>
              <li><em>FM</em>: Uses frequency modulation between two sounds. Similar to electric pianos.</li>
              <li><em>AM</em>: Uses amplitude modulation with two oscillators where one modulates the other with volume.</li>
            </ul>
          </div> : null}
          {/* WAVE TYPE MODALS */}
          {toggleInfo.waveType ?
            <div>
              <ul>
                <li><em>Sine</em>: The simplest waveform, shaped like smooth hills, that contains one frequency with no harmonics or overtones.</li>
                <li><em>Triangle</em>: Shaped like a triangle, the triangle wave contains a fundamental sound (much like Sine) but has odd harmonics.</li>
                <li><em>Square</em>: Shaped like a square, the square wave is similar to the triangle wave but is different in shape.</li>
                <li><em>Sawtooth</em>: Shaped like the edge of a saw, the sawtooth wave contains both odd and even harmonics and is considered to have the richest tone.</li>
              </ul>
            </div> : null}
          {toggleInfo.phaser ?
            <div>
              <ul>
                <li><em>Spread</em>: Controls the spread of the peaks in the waveform magnitude.</li>
                <li><em>Octaves</em>: Controls the distance between the high and low peaks in the spread of the frequencies</li>
              </ul>
            </div> : null}
          {toggleInfo.distortion ?
            <div>
              <ul>
                <li><em>Distortion</em>: Controls how much the waveform is distorted from its original form</li>
                <li><em>Dry/Wet</em>: Controls how much of the distortion is present in the output of the audio. The drier the filter, the less present it is.</li>
              </ul>
            </div> : null}
        </Modal.Body>
        <Modal.Footer>
          {toggleInfo.oscType ? <Button id='oscType' onClick={handleInfoToggle} className="btn btn-dark activeButton">Got it!</Button> : null}
          {toggleInfo.waveType ? <Button id='waveType' onClick={handleInfoToggle} className="btn btn-dark activeButton">Got it!</Button> : null}
          {toggleInfo.phaser ? <Button id='phaser' onClick={handleInfoToggle} className="btn btn-dark activeButton">Got it!</Button> : null}
          {toggleInfo.distortion ? <Button id='distortion' onClick={handleInfoToggle} className="btn btn-dark activeButton">Got it!</Button> : null}
        </Modal.Footer>
      </Modal>
      <div>
        <SynthDaw handleInfoToggle={handleInfoToggle} distortionFilter={distortionFilter} phaseFilter={phaseFilter} user={user} audioContext={audioContext} oscillatorOptions={oscillatorOptions} />
      </div>
    </Container>
  );
};

export default Synthesize;