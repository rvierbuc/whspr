import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';
import React, { useEffect, useState } from 'react';
import { GenericPlugin } from 'wavesurfer.js/dist/base-plugin';

let wavesurfer: WaveSurfer | null = null;
let record: GenericPlugin[] | null = null;
let scrollingWaveForm: boolean = false;

declare module 'wavesurfer.js' {
    interface WaveSurfer {
        record: RecordPlugin;
    }
}

const WaveSurferComponent = () => {
    const createSoundWaves = () => {
        //if there is a wavesurfer already, destroy it
        if (wavesurfer) {
            wavesurfer.destroy();
        }
        //create the new wave
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple',
            plugins: [
                RecordPlugin.create({
                    renderRecordedAudio: true,
                })
            ]
        });

        const plugins = wavesurfer.getActivePlugins() as GenericPlugin[];

        console.log(plugins);

        // record = plugins[0];
        
        // record.on('record-end', () => {
        //     console.log('record-end');
        //     scrollingWaveForm = true;
        // })

    }
    createSoundWaves();
}

export default WaveSurferComponent;