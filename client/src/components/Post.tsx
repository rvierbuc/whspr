import React, {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import Comment from "./Comment";
import { RecordComment } from "./RecordComment";
//import WaveSurferComponent from "./WaveSurfer";

 const Post = (props) => {
  const { postObj, userId, updatePost, audioContext } = props
  // const [commentInputOpen, setCommentInputOpen] = useState<boolean>(false)
  const [hearLess, setHearLess] = useState<boolean>(false)
  const [comments, setComments] = useState<any>([])
  
  const handleLike = async()=> {
    try{
       await axios.post('/post/like', {userId, postId: postObj.id})
       await axios.put('/post/updateCount', {type: 'increment', column: 'likeCount', id: postObj.id})
       await updatePost(postObj.id, userId)
    } catch(error){
      console.log('client could not like', error)
    }
  };
  const handleUnlike = async () => {
    try {
    //const likeObj = postObj.Likes.filter((likeObj) => likeObj.userId == user.id)
    //console.log(likeObj)
    await axios.delete(`/post/unlike/${userId}/${postObj.id}`)
    await axios.put('/post/updateCount', {type: 'decrement', column: 'likeCount', id: postObj.id})
    await updatePost(postObj.id, userId)
  } catch(error){
    console.log('client could not unlike', error)
  }
}

const getComments = async(limit: number, type: string) => {
try{
const commentsArr = await axios.get(`/post/comment/${postObj.id}/${limit}`)
if(commentsArr.data.length > 0 && type === 'more'){
  setComments(commentsArr.data)
  setHearLess(true)
  console.log('got new comments', commentsArr.data)
} else if(commentsArr.data.length > 0 && type === 'first'){
  setComments(commentsArr.data)
  console.log('got comments', commentsArr.data)
}
}catch(error) {
  console.error('could not get comments', error)
}
}

const handleHearLess = () => {
  const lessComments = comments.slice(0, 2)
  setComments(lessComments)
  setHearLess(false)
}

useEffect(() => {
  getComments(2, 'first')
}, [])
//style={{borderRadius: "75px"}}
  return(
    <div  >
      <div >
        {postObj.isLiked
          ?
         <div> <button
        type="button"
        className="btn"
        onClick={()=> handleUnlike()}
        style={{backgroundColor:'white', borderColor:'white', margin: '2%'}}
        ><svg width="50" height="50" fill='black' className="bi bi-heart-fill" viewBox="0 0 16 16" >
        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path> 
        </svg>
       </button>
       {/* {postObj.likeCount ? <p style={{marginLeft: '3%', fontSize:'x-large'}}>{`${postObj.likeCount} likes`}</p> : <p></p>}  */}
       </div>
        : <div> 
          <button
        type="button"
        className="btn"
        onClick={()=> handleLike()}
        style={{backgroundColor:'white', borderColor:'white', margin: '2%'}}
        > <svg width="50" height="50" fill="black" className="bi bi-heart" viewBox="0 0 16 16" >
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
      </svg>
        </button>
       {/* {postObj.likeCount ? <p style={{marginLeft: '3%', fontSize:'x-large'}}>{`${postObj.likeCount} likes`}</p> : <p></p>} */}
        </div>}
      </div>
      <div id="header" style={{margin: '16px', display: 'flex', flexDirection: 'column', alignContent:'center'}}>
      <h3 style={{marginLeft: '55px', marginTop:'20px'}}>Record Your Comment</h3>
         <RecordComment
         audioContext={audioContext}
         postObj={postObj}
         commentStateLength={comments.length}
         getComments={getComments}
         userId={userId}
         updatePost={updatePost}
         />
      </div>
      { comments
          ? comments.map((commentObj: any) => (
            <Comment 
            key={commentObj.id}
            comment={commentObj}
            audioContext={audioContext}
            />
          ))
          : <div>No Comments Yet!</div>
          }
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
            { comments && postObj.commentCount > comments.length
                  ? <button
                    style={{margin:'5px'}}
                    className='btn btn-light'
                    onClick={() => {getComments(comments.length + 5, 'more')}}
                    >hear more</button>
                  : <div></div>
              }
            {hearLess
            ? <button
            style={{margin:'5px'}}
              className= 'btn btn-light'
              onClick={() => handleHearLess()}>
              hear less
              </button> 
            : <div></div>}
          </div>
          
    </div>
  );
};
export default Post;