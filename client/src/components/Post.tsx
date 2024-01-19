import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Comment from './Comment';
import { RecordComment } from './RecordComment';
import { addSyntheticLeadingComment } from 'typescript';
import { Modal } from 'react-bootstrap';
//import WaveSurferComponent from "./WaveSurfer";

interface PostProps {
  postObj: any,
  userId: number,
  updatePost: any,
  audioContext: AudioContext,
  addComment: boolean,
  setAddComment: any,
  onProfile: boolean,
  onUserProfile: boolean,
  waveHeight: number,
}
const Post = (props) => {
  const { postObj, userId, updatePost, audioContext, addComment, setAddComment, onProfile, onUserProfile, waveHeight } = props;
  const [hearLess, setHearLess] = useState<boolean>(false);
  const [comments, setComments] = useState<any>([]);
  const getComments = async () => {
    try {
      const commentsArr = await axios.get(`/post/comment/${postObj.id}`);
      setComments(commentsArr.data);
      setHearLess(true);
      console.log('got new comments', commentsArr.data);
    } catch (error) {
      console.error('could not get comments', error);
    }
  };

  const handleHearLess = () => {
    //const lessComments = comments.slice(0, 2);
    setComments([]);
    setHearLess(false);
  };

  return (
    <div style={{minHeight:'50px'}} >
      {
        addComment ?
        // <Modal show={addComment}>
        <div className= 'post-bottom-overlay' style={{ margin: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: waveHeight / 2, }}>
        <div style={{ margin: '.5rem 0 .25rem 0', fontSize: onProfile || onUserProfile ? '1rem' : '2rem' }}>Record Your Comment</div>
         <RecordComment
         audioContext={audioContext}
         postObj={postObj}
         commentStateLength={comments.length}
         getComments={getComments}
         userId={userId}
         updatePost={updatePost}
         addComment={addComment}
         setAddComment={setAddComment}
         onProfile={onProfile || onUserProfile}
         />
      </div>
     // </Modal>
          : <div></div>
        }
     

      { comments.length > 0
        ? <div className='post-bottom-overlay on-profile-tags' style={{ margin: '1rem', maxHeight:'22rem',overflow:'scroll' }} >
          <div style={{ marginLeft: 'auto', marginRight:'auto', fontSize: onProfile || onUserProfile ? '1rem' : '2rem', color: '#e1e1e5' }}>Comments</div>
      { comments.map((commentObj: any) => (
          <Comment 
          key={commentObj.id}
          comment={commentObj}
          audioContext={audioContext}
          onProfile={onProfile || onUserProfile}
          />
      ))}
          </div>
        : <div></div>
        }
        
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
            { comments && postObj.commentCount > comments.length
              ? <button
                    style={{ marginLeft: '10px', marginBottom: '1rem', color: '#e1e1e5', background: 'transparent', textDecoration: 'underline', border: 'none' }}
                    //className='btn-link'
                    onClick={() => { getComments(); }}
                    >{`Listen to all ${postObj.commentCount} comments`}</button>
              : <div> <button className='simple-btn'></button></div>
              }
            {hearLess
              ? <button
              style={{ margin: '10px', marginBottom: '1rem', color: '#e1e1e5', background: 'transparent', textDecoration: 'underline', border: 'none' }}
              //className= 'btn-link'
              onClick={() => handleHearLess()}>
              Done Listening
              </button> 
              : <div></div>}
          </div>
          
    </div>
  );
};
export default Post;