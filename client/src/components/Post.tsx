import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import Comment from "./Comment";
import { RecordPost } from "./RecordPost"
 const Post = (props) => {
  const { postObj, getFriendsPosts, audioContext } = props
  const [commentInputOpen, setCommentInputOpen] = useState<boolean>(false)
  const [commentOpen, setCommentOpen] = useState<boolean>(false)
  const [comments, setComments] = useState<any>()
  //const [likedPosts, setLikedPosts] = useState<any>([])
  const userId = 1
  const userObj = {
    username: 'syd'
  }
  const handleLike = async()=> {
    try{
       await axios.post('/post/like', {userId, postId: postObj.id})
       await getFriendsPosts()
    } catch(error){
      console.log('client could not like', error)
    }
  }
const handleUnlike = async() => {
  try{
    const likeObj = postObj.Likes.filter((likeObj) => likeObj.userId === userId)
    await axios.delete(`/post/unlike/${likeObj[0].id}`)
    await getFriendsPosts()
  } catch(error){
    console.log('client could not unlike', error)
  }
}

const findLikedPost = () => {
  //console.log(friendsPosts.data)
  if(postObj.Likes.length > 0){
    for(let j = 0; j < postObj.Likes.length; j++){
      if(postObj.Likes[j].userId === userId){
        return true
      }
    }
  }
  return false
}

const getComments = async() => {
try{
const commentsArr = await axios.get(`/post/comment/${postObj.id}`)
if(commentsArr.data.length > 0){
  setComments(commentsArr.data)
}
}catch(error) {
  console.log()
}
}

useEffect(() => {
  getComments()
}, [])
//style={{borderRadius: "75px"}}
  return(
    <div className="card" >
      
      <div className="card-body" >
        <a href="#" className="card-link">{postObj.user.username}</a>
        <h3>{postObj.title}</h3>
        <audio controls>
          <source src={postObj.soundURL} type="audio/webm" />
        </audio>
        <h4>{`category: ${postObj.category}`}</h4>
        {findLikedPost()
        ?
          <button
        type="button"
        className="btn btn-light"
        onClick={()=> handleUnlike()}
        >unlike
        </button>
        : <button
        type="button"
        className="btn btn-dark"
        onClick={()=> handleLike()}
        >like
        </button>}
      </div>
      <div className="accordion" id="commentBox">
        <div className="accordion-item"></div>
        <h4 className="accordion-header">
          <button className="accordion-button collapsed"
           type="button"
           onClick={() => setCommentInputOpen(() => !commentInputOpen)}
           >Comment</button>
        </h4>
       {commentInputOpen ?
       <div id="commentInput" className="accordion-collapse show" data-bs-parent="#commentBox">
       <div className="accordion-body">
         <div className="input-group">
           <span className="input-group-text">{userObj.username}</span>
           <textarea className="form-control" aria-label="With textarea"></textarea>
           <button 
           type="button"
           className="btn btn-light"
           >submit</button>
         </div>
         {/* <RecordPost 
         audioContext={audioContext}
         /> */}
         <div className="accordion" id="previousComments">
        <div className="accordion-item"></div>
        <h4 className="accordion-header">
          <button className="accordion-button collapsed"
           type="button"
           onClick={() => setCommentOpen(() => !commentOpen)}
           >Show Comment</button>
        </h4>
        {commentOpen ?
        <div id="pastComments" className="accordion-collapse show" data-bs-parent="#commentBox"> 
        <div className="accordion-body">
          { comments
          ? comments.map((commentObj: any) => (
            <Comment 
            key={commentObj.id}
            comment={commentObj}
            />
          ))
          : <div>No Comments Yet!</div>
          }
        </div>
        </div>
        : <div id="pastComments" className="accordion-collapse collapse" /> }
        </div>
       </div>
     </div>
       : <div id="commentInput" className="accordion-collapse collapse" />}
      </div>
    </div>
  )
}
export default Post