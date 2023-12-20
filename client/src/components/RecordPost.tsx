import React, { useState, useRef } from 'react';
import axios from 'axios';


export const RecordPost = ({ user, audioContext, title, categories, openPost }: { user: any; audioContext: BaseAudioContext; title: string; categories: string[]; openPost: () => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const userId = user.id;
  console.log('category in record', categories);

  const startRecording = async () => {
    try {
      //for now, this resets the recording array to an empty array when recording starts
      setAudioChunks([]);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder?.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      // stop mic access
      const tracks = mediaRecorder.current.stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
  };

  const playAudio = async (): Promise<void> => {
    if ((audioChunks.length === 0) || !audioContext) {
      console.error('something was null: ', audioChunks.length === 0, !audioContext);
      return;
    }
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const arrayBuffer = await audioBlob.arrayBuffer();
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => {
        if (!audioContext) {
          console.error('audio context is null');
          return;
        }
        audioSource.current = audioContext.createBufferSource();
        audioSource.current.buffer = buffer;
        audioSource.current.connect(audioContext.destination);

        audioSource.current.onended = () => {
          setIsPlaying(false);
        };
        audioSource.current.start();
        setIsPlaying(true);
      },
      (error) => {
        console.error('error playing audio: ', error);
      },
    ).catch((playError) => {
      console.error('error playing: ', playError);
    });
  };

  const stopPlaying = () => {
    if (audioSource.current) {
      audioSource.current.stop();
      setIsPlaying(false);
    }
  };

  const emptyRecording = () => {
    setAudioChunks([]);
  };

  const saveAudioToGoogleCloud = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('userId', userId);
      formData.append('title', title);
      // formData.append('category', categories)
      categories.forEach((category, index) => {
        console.log('foreach', category, index);
        formData.append(`category[${index}]`, category);
      });
      console.log('formdata', Object.fromEntries(formData.entries()));
      const response = await axios.post('/upload', formData);
      if (response.status === 200) {
        console.info('Audio save successfully');
      } else {
        console.error('Error saving audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  return (
        <div className="d-flex justify-content-center" style={{ margin: '15px' }}>
          <button
            className="record-button"
            onClick={startRecording}
            disabled={isRecording}
            ><img src={require('../style/recordbutton.png')} /></button>
            <button
            className="play-button"
            onClick={playAudio}
            disabled={isPlaying || audioChunks.length === 0 }
            ><img src={require('../style/playbutton.png')} /></button>
            <button
            className="stop-button"
            onClick={isRecording ? stopRecording : stopPlaying}
            disabled={!isRecording && !isPlaying}
            ><img src={require('../style/stopbutton.png')} /></button>
            <button
            className="delete-button"
            onClick={emptyRecording}
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../style/deletebutton.png')} /></button>
            <button
            className="post-button"
            onClick={()=>{
              openPost();
              saveAudioToGoogleCloud();
            }
            }
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../style/postbutton.png')} /></button>
        </div>
  );
};
