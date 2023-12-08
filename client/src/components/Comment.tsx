import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";

const Comment = (props) => {
  const { comment } = props
return (
  <div className="card-body" >
        <a href="#" className="card-link">{comment.User.username}</a>
        <audio controls>
          <source src={comment.soundURL} type="audio/webm" />
        </audio>
  </div>
)
}
export default Comment