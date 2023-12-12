import React, {useEffect, useState} from 'react'
import socket from './socket'
import Post from './Post'
import RecordPost from './RecordPost'

const MagicConch = ({ audioContext }: { audioContext: BaseAudioContext }) => {
    const [messages, setMessages] = useState<any>()
    const [type, setType] = useState<string>('inbox')




    const getMessages = (type) => {
        if(type === 'inbox'){

        }
    }

    return (
        <div>

            <RecordPost/>

            <div>

            </div>
            <button
        type="button"
        className="btn btn-dark"
        onClick={() => getMessages('inbox')}
        >Following</button>
        <button
        type="button"
        className="btn btn-light"
        onClick={() => getMessages('outbox')}
        >Explore</button>

        <div>
            {messages ? messages.map((message: any) => (
        <Post
          key = {message.id}
          postObj = {message}
          audioContext={audioContext}
        />
      )) : <div>Loading...</div>}
        </div>
        </div>
        
    )
}

export default MagicConch