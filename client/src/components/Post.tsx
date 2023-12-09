import React from "react";

 const Post = (props) => {
  const { postObj } = props
  return(
    <div className="card">
      <div className="card-body">
        <h4>{postObj.user.username}</h4>
        <h3>{postObj.title}</h3>
        <audio controls>
          <source src={postObj.soundURL} type="audio/wav" />
        </audio>
        <h4>{`category: ${postObj.category}`}</h4>
      </div>
      
    </div>
  )
}
export default Post