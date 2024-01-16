import React, { useEffect, useState } from 'react';
import socket from './socket';
import PostConch from './PostConch';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
import { useLoaderData } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import Modal from 'react-bootstrap/Modal';

const MagicConch = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [messages, setMessages] = useState<any>();
  const [type, setType] = useState<string>('inbox');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [showConch, setShowConch] = useState<boolean>(false);
  const [sharedPosts, setSharedPosts] = useState(null);
  const user: any = useLoaderData();
  console.log('user', user);

  const getMessage = async () => {
    try {
      const response: AxiosResponse = await axios.get(`/conch/${user.id}`);
      console.log('message', response);
      const messages = response.data;
      messages.user = user;
      messages.userId = user.id;
      setMessages(messages);
      setShowConch(true);
    } catch (error) {
      console.log('couldnt get message', error);
    }
  };

  const getOutbox = async () => {
    try {
      const response: AxiosResponse = await axios.get(`/conch/sent/${user.id}`);
      console.log('message', response);
      const messages = response.data;
      messages.user = user;
      messages.userId = user.id;
      setMessages(messages);
    } catch (error) {
      console.log('couldnt get message', error);
    }
  };

  const getMessages = (type) => {
    if (type === 'inbox') {
      setType(type);
      getMessage();
    } else {
      setType(type);
      getOutbox();
          
    }
  };

  const getSharedPosts = async (idType) => {
    try {

      const sharedPostsArray: AxiosResponse = await axios.get(`/post/shared/${user.id}/${idType}`);
      if (sharedPostsArray.data.length > 0) {
        setSharedPosts(sharedPostsArray.data);
      }
    } catch (error) {
      console.error('error getting shared posts in inbox', error);
    }
  };
  useEffect(() => {
    getMessage();
    getSharedPosts('sentToId');
  }, []);


  return (
        <div >
          <div style={{color: 'white'}}>
            <h2>Record a message that gets sent to a random user!</h2>
          </div>

            <PostConch audioContext={audioContext} />

            {/* <input
            type="checkbox"
            /> */}
            
            <div className="custom-checkbox">
  {/* <input id="status" 
         type="checkbox" 
         name="status"/>
  <label htmlFor="status">
    <div className="status-switch"
         data-unchecked="Off"
         data-checked="On">
    </div>
  </label> */}
</div>
  

            {/* <button
                type="button"
                className="btn btn-dark"
                onClick={() => getMessages('inbox')}
            >Inbox</button>
            <button
                type="button"
                className="btn btn-light"
                onClick={() => getMessages('outbox')}
            >Outbox</button> */}

          <div style={{ justifyContent: 'center', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>

{type === 'inbox' ?
    <div>
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
      </div>}
            </div>


            <div>
                {message ? 
                  <Modal show={showConch} onHide={() => setShowConch(false)} aria-labelledby="contained-modal-title-vcenter"
                  centered>
                    <Modal.Header>You have been Conched!!</Modal.Header>
                      <WaveSurferComponent onConch={true} postObj={message} audioUrl={message.soundUrl} postId={message.id} />
                    </Modal>
                  : <div>No messages!</div>}
            </div>
            <div>
              {sharedPosts ? sharedPosts.map((post) => (
                <div key={post.id}>
                  <div>{`${post.sentFromUser.username} sent you a post:`}</div>
                  <div>{post.Post.title}</div>
                </div>
              )) : <div>no messaged yet!</div>} 
            </div>
        </div>

  );
};

export default MagicConch;