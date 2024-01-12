import React, { useEffect, useState } from 'react';
import socket from './socket';
import PostConch from './PostConch';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
import { useLoaderData } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

const MagicConch = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [messages, setMessages] = useState<any>();
  const [type, setType] = useState<string>('inbox');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const user: any = useLoaderData();
  console.log('user', user);


  useEffect(() => {
    getMessage();
  }, []);


    const getMessage = async() => {
        try{
          const response: AxiosResponse = await axios.get(`/conch/${user.id}`)
          console.log('message', response)
            const messages = response.data
            messages.user = user
            messages.userId = user.id
          setMessages(messages)
        } catch(error) {
          console.log('couldnt get message', error)
        }
      }

      const getOutbox = async() => {
        try{
          const response: AxiosResponse = await axios.get(`/conch/sent/${user.id}`)
          console.log('message', response)
            const messages = response.data
            messages.user = user
            messages.userId = user.id
          setMessages(messages)
        } catch(error) {
          console.log('couldnt get message', error)
        }
      }



  const getMessages = (type) => {
    if (type === 'inbox') {
      setType(type);
      getMessage();
    } else {
      setType(type);
      getOutbox();
          
    }
  };



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

          <div style={{justifyContent: 'center', flexDirection: 'column', display: 'flex', alignItems: 'center'}}>

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
                {messages ? 
                    messages.map((message) => {
                      <WaveSurferComponent postObj={message} audioUrl={message.soundUrl} postId={message.id} />
                    })
                  : <div>No messages!</div>}
            </div>
        </div>

  );
};

export default MagicConch;