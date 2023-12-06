import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import NavBar from './NavBar'

const Post = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const handleCreatePost = () => {
    setPostCreated(!postCreated)
  }
  return (
    <div>
      <NavBar />
        <h1>record a post</h1>
        <button onClick={handleCreatePost}>Record a Post</button>

{postCreated && (
<div>
<RecordPost audioContext={audioContext}/>
<button onClick={handleCreatePost}>Cancel</button>
</div>
)}

  </div>
  )
}

export default Post
