import WaveSurfer from "wavesurfer.js";
//import RecordPlugin from 'wavesurfer.js/dist/plugins/record'
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import React, { useEffect, useState } from "react";
//import axios from 'axios';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Col } from "react-bootstrap";
// import Post from "./Post"
dayjs.extend(relativeTime);
interface WaveSurferProps {
  audioUrl: string;
  postId: number;
  audioContext: AudioContext;
}

const WaveSurferComponent: React.FC<WaveSurferProps> = ({
  audioUrl,
  postId,
  audioContext,
}) => {
  const [wave, setWave] = useState<WaveSurfer | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const containerId = `waveform-${postId || ""}-comment`;
  const createSoundWaves = () => {
    let regions: RegionsPlugin;
    //if there is a wavesurfer already, destroy it
    if (wave) {
      wave.destroy();
    }
    //create the new wave
    console.log("creating new wave");
    const wavesurfer = WaveSurfer.create({
      // barWidth: 15,
      // barRadius: 5,
      // barGap: 2,
      interact: true,
      container: `#${containerId}`,
      waveColor: "rgb(166, 197, 255)",
      progressColor: "rgb(60, 53, 86)",
      url: audioUrl,
      width: "auto",
      height: 80,
      normalize: true,
    });

    regions = wavesurfer.registerPlugin(RegionsPlugin.create());

    wavesurfer.on("click", () => {
      regions.addRegion({
        start: wavesurfer.getCurrentTime(),
        end: wavesurfer.getCurrentTime() + 0.25,
        drag: true,
        color: "hsla(250, 100%, 30%, 0.5)",
        id: "test",
      });
    });
    wavesurfer.on("finish", async () => {
      setIsPlaying(false);
    });
 
    setWave(wavesurfer);
    setDisplay(true);
    console.log("wave created!");
  };

  useEffect(() => {
    createSoundWaves();
  }, [audioUrl]);
  return (
    <div style={{display: 'flex', flexDirection:'row', alignItems:'center', justifyContent:'start'}}>
      {isPlaying ? (
        <button
          type="button"
          className="btn btn-danger btn-lg"
          id="play-btn"
          style={{marginRight: '6px'}}
          onClick={() => {
            if (wave) {
              wave.playPause();
              setIsPlaying(() => !isPlaying);
            }
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
            if (wave) {
              wave.playPause();
              setIsPlaying(() => !isPlaying);
            }
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
