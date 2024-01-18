import React, { useEffect, useState } from 'react';
import socket from './socket';
import PostConch from './PostConch';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
import WaveSurferSimple from './WaveSurferSimple';
import { useLoaderData } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
//import Modal from 'react-bootstrap/Modal';
import { ConchModal } from './ConchModal';
import { Mail } from './Mail';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//import { ReactComponent as ConchTitle } from '../style/conch-title.svg';
dayjs.extend(relativeTime);

const MagicConch = ({ audioContext }: { audioContext: AudioContext }) => {
  const [message, setMessage] = useState<any>();
  const [type, setType] = useState<string>('inbox');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [showConch, setShowConch] = useState<boolean>(false);
  const [sharedPosts, setSharedPosts] = useState(null);
  const [displayPost, setDisplayPost] = useState(null);
  const [displayMessage, setDisplayMessage] = useState(null);
  // const [shareUser, setShareUser] = useState(null);
  const user: any = useLoaderData();
  console.log('user', user);

  const getMessage = async () => {
    try {
      const response: AxiosResponse = await axios.get(`/conch/${user.id}`);
      console.log('message', response.data);
      const tempMessage = response.data[0];
      tempMessage.user = tempMessage.sentFromUser;
      tempMessage.userId = tempMessage.sentFromUser.id;
      setMessage(tempMessage);
      setShowConch(true);
    } catch (error) {
      console.log('couldnt get message', error);
    }
  };

  const getOutbox = async () => {
    try {
      const response: AxiosResponse = await axios.get(`/conch/sent/${user.id}`);
      console.log('message', response);
      // const tempMessage = response.data;
      // tempMessage.user = tempMessage.sentFromUser;
      // tempMessage.userId = tempMessage.sentFromUser.id;
      setMessage(response.data);
    } catch (error) {
      console.log('couldnt get message', error);
    }
  };

  console.log('display message', displayMessage);

  const getSharedPosts = async (idType) => {
    try {
      const sharedPostsArray: AxiosResponse = await axios.get(`/post/shared/${user.id}/${idType}`);
      if (sharedPostsArray.data.length > 0) {
        console.log('get shared posts', sharedPostsArray.data);
        setSharedPosts(sharedPostsArray.data);
      }
    } catch (error) {
      console.error('error getting shared posts in inbox', error);
    }
  };
  const getMessages = (type) => {
    if (type === 'inbox') {
      setType(type);
      // getMessage();
      if (displayPost) {
        setDisplayPost(null);
      }
      getSharedPosts('sentToId');
    } else {
      setType(type);
      // getOutbox();
      setDisplayPost(null);
      getSharedPosts('sentFromId');
    }
  };
  useEffect(() => {
    getMessage();
    getSharedPosts('sentToId');
  }, []);


  return (
        <div >
{/** commented out code below component */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem' }}>
    <img src={require('../style/inbox.png')}></img>
{/* {type === 'inbox' ?
    <div >
        <button
        type="button"
        className="btn btn-dark"
        onClick={() => getMessages('inbox')}
        >Inbox</button>
        <button
        type="button"
        className="btn btn-light"
        onClick={() => getMessages('outbox')}
        >Outbox</button>
    </div>
  : <div>
      <button
        type="button"
        className="btn btn-light"
        onClick={() => getMessages('inbox')}
        >Inbox</button>
        <button
        type="button"
        className="btn btn-dark"
        onClick={() => getMessages('outbox')}
        >Outbox</button>
      </div>} */}
            </div>


            <div>
            {message ? 
            // <Modal  show={showConch} onHide={() => setShowConch(false)} aria-labelledby="contained-modal-title-vcenter"
            // centered>
            //   <Modal.Body className='bs-conch-modal-content'>
            //   <Modal.Header>You have been Conched!!</Modal.Header>
            //     <WaveSurferComponent onConch={true} waveHeight={300} postObj={message} audioUrl={message.soundUrl} postId={message.id} />
            //     </Modal.Body>
            //   </Modal>

    <ConchModal isOpen={showConch} onClose={() => setShowConch(false)} >
      <div style={{ width: '100%' }}> 
      <div style={{ margin: '.5rem 1rem .5rem 1rem ' }} onClick={() => setShowConch(false)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
      </div>
      <div className='conch-title' >
        A MAGIC CONCH HAS WASHED UP JUST FOR YOU!
      </div>
          <WaveSurferComponent onConch={true} waveHeight={300} postObj={message} audioUrl={message.soundUrl} postId={message.id} />
          {/* <div className="wave"></div> */}
      </div>
     </ConchModal>
              : <div></div>}
            </div>
            <div className='card' style={{ display: 'flex', flexDirection: 'row', margin: 'auto', maxWidth: '75vw', minWidth: '700px', maxHeight: '700px' }}>
              <div className='on-profile-tags' style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', padding: '1rem', width: '50%', maxHeight: '650px', overflow: 'scroll' }}>
              {sharedPosts ? sharedPosts.map((post, index) => (
                <Mail
                key={post.id}
                sharePost={post}
                audioContext={audioContext}
                currUser={user}
                type={type}
                setDisplayMessage={setDisplayMessage}
                setDisplayPost={setDisplayPost}
                setSharedPosts={setSharedPosts}
                sharePostIndex={index}
                sharedPosts={sharedPosts}
                ></Mail>
              )) : <div>no messaged yet!</div>} 
                </div>
               {displayPost ? 
               <div className='display-message'id='message' >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'baseline' }}>
               <h3 id='share-user'>{type === 'inbox' ? `From: ${displayMessage.sentFromUser.username}` : `To: ${displayMessage.sentToUser.username}`}</h3>
                <div style={{ marginLeft: 'auto' }}>{dayjs(displayMessage.createdAt).fromNow()}</div>
                  </div>
               <WaveSurferSimple
               audioContext={audioContext}
               audioUrl={displayMessage.captionUrl}
               postId={displayMessage.id}
               type={'mailbox'}
               ></WaveSurferSimple>
               </div>
               <WaveSurferComponent
               postObj={displayPost}
               userId={user.id}
               audioUrl={displayPost.soundUrl}
               audioContext={audioContext}
               onConch={true}
               waveHeight={300}
               ></WaveSurferComponent>  
               </div>
                 : <div className='display-message' id='no-message'>
                  <img src={require('../style/listen.png')} id='select-mess-img'/>
                  <div style={{ fontSize: '2rem', width: '25rem', overflow: 'wrap', marginBottom: '10rem', textAlign: 'center', color: '#e1e1e1' }}>Select a message from the left to listen</div>
                  </div>}
            </div>
        </div>

  );
};

export default MagicConch;

{ /* <PostConch audioContext={audioContext} /> */ }

{ /* <input
            type="checkbox"
            /> */ }
            
{ /* <div className="custom-checkbox"> */ }
{ /* <input id="status" 
         type="checkbox" 
         name="status"/>
  <label htmlFor="status">
    <div className="status-switch"
         data-unchecked="Off"
         data-checked="On">
    </div>
  </label> */ }
{ /* </div> */ }
  

{ /* <button
                type="button"
                className="btn btn-dark"
                onClick={() => getMessages('inbox')}
            >Inbox</button>
            <button
                type="button"
                className="btn btn-light"
                onClick={() => getMessages('outbox')}
            >Outbox</button> */ }