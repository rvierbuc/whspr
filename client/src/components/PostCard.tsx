import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import NavBar from './NavBar'

const Post = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const handleCreatePost = () => {
    setPostCreated(!postCreated)
  }
  return (
    <div>
      <NavBar />
        <h1>record a post</h1>
        <button onClick={handleCreatePost}>Record a Post</button>

{postCreated && (<div>
<div>
          title: <input type="text"
          value={title} 
          onChange={(e) => { setTitle(e.target.value) }}/>
          </div>
          <div>
          category: <input type="text" 
          value={category} 
          onChange={(e) => { setCategory(e.target.value) }}/>
          </div>
<RecordPost
audioContext={audioContext}
title={title}
category={category}

/>
<button onClick={handleCreatePost}>Cancel</button>
</div>
)}

  </div>
  )
}

export default Post
