import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import WaveSurferComponent from './WaveSurfer';
interface MailBoxProps {
  sharePost: any,
  audioContext: AudioContext,
  currUser: any,
  setDisplayPost: any,
  setDisplayMessage: any,
  type: string,
}
export const Mail: React.FC<WaveSurferProps> = ({
  sharePost, type, audioContext, currUser, setDisplayPost, setDisplayMessage
}) => {
  const user = sharePost.sentFromUser ? sharePost.sentFromUser : sharePost.sentToUser;
  console.log('type', type);
  const getFullPost = async () => {
    try {
      const fullPost = await axios.get(`/post/updatedPost/${sharePost.Post.id}/${currUser.id}`);
      await setDisplayPost(fullPost.data);
      await setDisplayMessage(sharePost);
    } catch (error) {
      console.error('could not get full post in mailbox', error);
    }
  };
  return (
    <div id='header' style={{width:'75%'}}onClick={() => getFullPost()} >
      {type === 'inbox' ? <div>{`${user.username} sent you a post:`}</div> : <div>{`You sent ${user.username} a post:`}</div>}
       <div>{sharePost.Post.title}</div>
    </div>
  );
};