import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Comment from './Comment';
import { RecordComment } from './RecordComment';
import { addSyntheticLeadingComment } from 'typescript';
//import WaveSurferComponent from "./WaveSurfer";

const Post = (props) => {
  const { postObj, userId, updatePost, audioContext, addComment, setAddComment } = props;
  const [hearLess, setHearLess] = useState<boolean>(false);
  const [comments, setComments] = useState<any>([]);
  
  const getComments = async (limit: number, type: string) => {
    try {
      const commentsArr = await axios.get(`/post/comment/${postObj.id}/${limit}`);
      if (commentsArr.data.length > 0 && type === 'more') {
        setComments(commentsArr.data);
        setHearLess(true);
        console.log('got new comments', commentsArr.data);
      } else if (commentsArr.data.length > 0 && type === 'first') {
        setComments(commentsArr.data);
        console.log('got comments', commentsArr.data);
      }
    } catch (error) {
      console.error('could not get comments', error);
    }
  };

  const handleHearLess = () => {
    //const lessComments = comments.slice(0, 2);
    setComments([]);
    setHearLess(false);
  };

  useEffect(() => {
    //getComments(2, 'first');
  }, []);
  //style={{borderRadius: "75px"}}
  return (
    <div >
      {
        addComment ?
        <div id="header" style={{ margin: '16px', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
        <h3 style={{ marginLeft: '55px', marginTop: '20px' }}>Record Your Comment</h3>
         <RecordComment
         audioContext={audioContext}
         postObj={postObj}
         commentStateLength={comments.length}
         getComments={getComments}
         userId={userId}
         updatePost={updatePost}
         />
      </div>
          : <div></div>
        }
     

      { comments.length > 0
        ? <div className='card' style={{ margin: '1rem' }} >
          <div style={{margin:'auto', fontSize:'32px', color:'#e1e1e5'}}>Comments</div>
      { comments.map((commentObj: any) => (
          <Comment 
          key={commentObj.id}
          comment={commentObj}
          audioContext={audioContext}
          />
      ))}
          </div>
        : <div></div>
        }
        
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', }}>
            { comments && postObj.commentCount > comments.length
              ? <button
                    style={{marginLeft: '10px', marginBottom:'1rem', color: '#e1e1e5', background:'transparent', textDecoration:'underline', border:'none'}}
                    //className='btn-link'
                    onClick={() => { getComments(comments.length + 5, 'more'); }}
                    >{`Listen to all ${postObj.commentCount} comments`}</button>
              : <div></div>
              }
            {hearLess
              ? <button
              style={{ margin: '10px', marginBottom:'1rem', color: '#e1e1e5', background:'transparent', textDecoration:'underline', border:'none'}}
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