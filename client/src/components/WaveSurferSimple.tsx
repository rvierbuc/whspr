import WaveSurfer from 'wavesurfer.js';
//import RecordPlugin from 'wavesurfer.js/dist/plugins/record'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Col } from 'react-bootstrap';
// import Post from "./Post"
dayjs.extend(relativeTime);
interface WaveSurferProps {
  audioUrl: string;
  postId: number;
  audioContext: AudioContext;
  type: string;
  onShare: boolean;
}

const WaveSurferComponent: React.FC<WaveSurferProps> = ({
  audioUrl,
  postId,
  audioContext,
  onShare,
  type,
}) => {
  const [wave, setWave] = useState<WaveSurfer | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const containerId = `waveform-${postId || ''}-${type}`;
  const createSoundWaves = () => {
    let regions: RegionsPlugin;
    //if there is a wavesurfer already, destroy it
    if (wave) {
      wave.destroy();
    }
    //create the new wave
    console.log('creating new comment wave');
    const wavesurfer = WaveSurfer.create({
      // barWidth: 15,
      // barRadius: 5,
      // barGap: 2,
      interact: true,
      container: `#${containerId}`,
      waveColor: 'rgb(166, 197, 255)',
      progressColor: 'rgb(60, 53, 86)',
      url: audioUrl,
      width: 'auto',
      height: 80,
      normalize: true,
   
      renderFunction: (channels, ctx) => {
        const { width, height } = ctx.canvas;
        const scale = channels[0].length / width;
        const step = 10;

        ctx.translate(0, height / 2);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();

        for (let i = 0; i < width; i += step * 2) {
          const index = Math.floor(i * scale);
          const value = Math.abs(channels[0][index]);
          let x = i;
          let y = value * height;

          ctx.moveTo(x, 0);
          ctx.lineTo(x, y);
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
          ctx.lineTo(x + step, 0);

          x = x + step;
          y = -y;

          ctx.moveTo(x, 0);
          ctx.lineTo(x, y);
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
          ctx.lineTo(x + step, 0);
        }

        ctx.stroke();
        ctx.closePath();
      },
    });
  
    regions = wavesurfer.registerPlugin(RegionsPlugin.create());

    wavesurfer.on('click', () => {
      regions.addRegion({
        start: wavesurfer.getCurrentTime(),
        end: wavesurfer.getCurrentTime() + 0.25,
        drag: true,
        color: 'hsla(250, 100%, 30%, 0.5)',
        id: 'test',
      });
    });
    wavesurfer.on('finish', async () => {
      setIsPlaying(false);
    });
 
    setWave(wavesurfer);
    setDisplay(true);
    console.log('wave created!');
  };

  useEffect(() => {
    createSoundWaves();
  }, [audioUrl]);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', marginLeft: onShare ? '0' : '1rem', marginRight:'1rem' }}>
      {isPlaying ? (
        <button
          type="button"
          //className="btn btn-danger btn-lg"
          id="stop-btn-new"
          style={{ marginRight: '16px' }}
          onClick={() => {
            if (wave) {
              wave.playPause();
              setIsPlaying(() => !isPlaying);
            }
          }}
        >
        </button>
      ) : (
        <button
          type="button"
          //className="btn btn-light btn-lg"
          style={{ marginRight: '16px' }}
          id="play-btn-new"
          onClick={() => {
            if (wave) {
              wave.playPause();
              setIsPlaying(() => !isPlaying);
            }
          }}
        >
        </button>
      )}
      <Col>
      <div id={containerId}></div>
      </Col>
    </div>
    // <Container>
    //   <Row className="align-items-center">
    //     <Col xs={1} >

  //     </Col>
  //     <Col xs={1}></Col>
  //     <Col xs={10} >

  //     </Col>

  //   </Row>
  // </Container>
  );
};

export default WaveSurferComponent;