import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'
import React, { useEffect, useState } from 'react';
import { GenericPlugin } from 'wavesurfer.js/dist/base-plugin';
import { WaveSurferPlugin } from 'wavesurfer.js/types/plugin';
import  create  from 'wavesurfer.js';

let wavesurfer: any;
let record: RecordPlugin;
let scrollingWaveForm: boolean = false;

declare module 'wavesurfer.js' {
    interface WaveSurfer {
        record: RecordPlugin;
    }
}


const WaveSurferComponent = () => {
    const [wave, setWave] = useState<WaveSurfer | null>(null);
    const [display, setDisplay] = useState<boolean>(false); 
    
    const createSoundWaves = () => {
        //if there is a wavesurfer already, destroy it
        if (wavesurfer) {
            wavesurfer.destroy();
        }
        //create the new wave
        console.log('creating new wave')
        wavesurfer = WaveSurfer.create({
            barWidth: 2,
            barRadius: 4,
            barGap: 3,
            interact: true,
            container: '#waveform',
            waveColor: 'rgb(0, 0, 0)',
            progressColor: 'rgb(0, 0, 255)',
            url: './test/creep.client/src/components/test/creep.mp3',
            width: "auto",
            height: "auto",
        });
        wavesurfer.load('./test/creep.mp3').then(() => {
            console.log('loaded')
        });
        wavesurfer.on('interaction', () => {
            wavesurfer.play();
        });
        
        console.log('wave created!', wavesurfer)
        setWave(wavesurfer);
        setDisplay(true);
    }

    useEffect(() => {
        createSoundWaves();
    }, []);
    return (
        <div>
            <h1>hello</h1>
            <div id="waveform"></div>
        </div>
    )
}

export default WaveSurferComponent;