import React, { useState } from 'react'
import { RecordConch } from './RecordConch'
import { useLoaderData } from 'react-router-dom'

const PostConch = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const user = useLoaderData()

  const openPost = () => {
    setPostCreated(!postCreated)
  }
  
  return (
    <div>
      <div className="d-flex justify-content-center">
<button  
      type="button"
      className="btn btn-dark"
      style={{margin:'15px'}}
      onClick={openPost}>
        Write Post
      </button>
      </div>
{postCreated && (
<div id="responsive-navbar-nav" className={postCreated ? 'show' : ''}>
<div className="d-flex justify-content-center">
          <input type="text"
          maxLength={22}
          placeholder="What's on your mind?"
          value={title} 
          onChange={(e) => { setTitle(e.target.value) }}
          className='input-control'
          />
          </div>
<RecordConch
user={user}
audioContext={audioContext}
title={title}
category={category}
openPost={openPost}
/>
</div>
)}

  </div>
  )
}

export default PostConch