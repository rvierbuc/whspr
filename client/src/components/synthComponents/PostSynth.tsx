import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: any
  audioChunks: Blob[]
  synthAudioChunks: Blob[]
  isRecording: boolean
}

const PostSynth = ({ isRecording, synthAudioChunks, userId, audioChunks}: Props) => {
  const [ title, setTitle ] = useState('');
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  }

  const categories: string[] = ['Voice Filter', 'Filter', 'Robot', 'Alien', 'Underwater'];


  let audioBlob: Blob;
  if (!audioChunks.length && synthAudioChunks.length) {
    audioBlob = new Blob(synthAudioChunks, { type: 'audio/wav' })
  } else if (audioChunks.length && !synthAudioChunks.length) {
    audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
  }

  const saveAudioToGoogleCloud = async () => {
    const postTitle = title;
    setTitle('');
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', postTitle);
      categories.forEach((category, index) => {
        formData.append(`category[${index}]`, category);
      });
      const response = await axios.post('/upload', formData);
      response.status === 200 ? console.info('Audio saved successfully') : console.error('Error saving audio', response.statusText);
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <input type="text"
      maxLength={22}
      placeholder="What's on your mind?"
      value={title}
      onChange={(e) => { setTitle(e.target.value) }}
      className='input-control text-white'
      />
      <button
        className="post-button m-2"
        onClick={saveAudioToGoogleCloud}
        disabled={isRecording}
      ><img src={require('../../style/postbutton.png')} /></button>
    </div>
  );
};

export default PostSynth;