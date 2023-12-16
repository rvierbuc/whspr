import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: any
  audioChunks: any
  isRecording: boolean
}

const PostSynth = ({ isRecording, audioChunks, userId}: Props) => {
  const [ title, setTitle ] = useState('');

  const handleEdit = (e: any) => {
    setTitle(e.target.value);
  };

  const saveAudioToGoogleCloud = async () => {
    let postTitle = title;
    setTitle('');
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('userId', userId)
      formData.append('title', postTitle)
      formData.append('category', 'Voice Synth')
      const response = await axios.post(`/upload`, formData)
      response.status === 200 ? console.info('Audio saved successfully') : console.error('Error saving audio', response.statusText);
    } catch (error) {
      console.error('Error saving audio:', error)
    }
  }

  return (
    <div>
      <input type="text" value={title} onChange={handleEdit} />
      <button
            className="post-button"
            onClick={()=>{
              saveAudioToGoogleCloud()}
            }
            disabled={audioChunks.length === 0 || isRecording}
            ><img src={require('../../style/postbutton.png')} /></button>
    </div>
  );
};

export default PostSynth;