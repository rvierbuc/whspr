import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import { useLoaderData } from 'react-router-dom'

const PostCard = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const handleCreatePost = () => {
    setPostCreated(!postCreated)
  }
  const user = useLoaderData()
  console.log(user)
  return (
    <div>
      <div className="d-flex justify-content-center">
<button  
      type="button"
      className="btn btn-dark"
      style={{margin:'15px'}}
      onClick={handleCreatePost}>
        Post
      </button>
      </div>
{postCreated && (<div>
<div className="d-flex justify-content-center">
          <input type="text"
          placeholder="What's on your mind?"
          value={title} 
          onChange={(e) => { setTitle(e.target.value) }}
          className='input-control'
          />
          </div>
<RecordPost
user={user}
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
