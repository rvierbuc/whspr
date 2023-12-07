import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import NavBar from './NavBar'

const PostItem = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postRecord, setPostRecord] = useState({
    postId: 1,
    userId: 1,
    title: 'eastbound and down',
    category: 'loaded up and trucking',
    audioUrl: 'https://storage.googleapis.com/whspr-sounds/audio/1701901644758.wav'
  })
  return (
    <div>
      <NavBar />
      <div>
        <h1>{postRecord.title}</h1>
        <h6>{postRecord.category}</h6>
        <audio controls>
          <source src={postRecord.audioUrl} type="audio/wav" />
        </audio>
      </div>
    </div>
  );
};

export default PostItem
