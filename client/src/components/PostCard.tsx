import React, { useState } from 'react'
import { RecordPost } from './RecordPost'

const PostCard = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const handleCreatePost = () => {
    setPostCreated(!postCreated)
  }
  return (
    <div>
<button  
      type="button"
      className="btn btn-dark"
      style={{margin:'15px'}}
      onClick={handleCreatePost}>
        Post
      </button>
{postCreated && (<div>
<div>
          <input type="text"
          placeholder="What's on your mind?"
          value={title} 
          onChange={(e) => { setTitle(e.target.value) }}
          className='input-control'
          />
          </div>
<RecordPost
audioContext={audioContext}
title={title}
category={category}
/>
</div>
)}

  </div>
  )
}

export default PostCard
