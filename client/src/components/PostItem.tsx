import React, { useState } from 'react'
import NavBar from './NavBar'

const PostItem = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postRecord, setPostRecord] = useState({
    postId: 1,
    userId: 1,
    title: 'eastbound and down',
    category: 'loaded up and trucking',
    audioUrl: 'https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3'
  })
  return (
    <div>
      <div>
        <h1>{postRecord.title}</h1>
        <h6>{postRecord.category}</h6>
        <audio controls>
          <source src={postRecord.audioUrl} type="audio/wav" />
        </audio>
      </div>
    </div>
  )
}

export default PostItem
