import React from "react";

 const Post = (props) => {
  const { postObj } = props
  return(
    <div>
      <h3>{postObj.Posts[0].title}</h3>
      <h4>{postObj.user.username}</h4>
      <h4>{`audio: ${postObj.recordingUrl}`}</h4>
      <h4>{`category: ${postObj.Posts[0].category}`}</h4>
    </div>
  )
}
export default Post