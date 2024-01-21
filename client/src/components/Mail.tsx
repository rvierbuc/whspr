import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import WaveSurferComponent from './WaveSurfer';
import { GoDotFill } from 'react-icons/go';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
interface MailBoxProps {
  sharePost: any,
  audioContext: AudioContext,
  currUser: any,
  setDisplayPost: any,
  setDisplayMessage: any,
  type: string,
  sharePostIndex: number,
  setSharedPosts: any,
  sharedPosts: any,
}
export const Mail: React.FC<WaveSurferProps> = ({
  sharePost, type, audioContext, currUser, setDisplayPost, setDisplayMessage, sharePostIndex, setSharedPosts, sharedPosts
}) => {
  const user = sharePost.sentFromUser ? sharePost.sentFromUser : sharePost.sentToUser;
  const getFullPost = async () => {
    try {
      const seenMessage = await axios.put('/post/hasSeen', { id: sharePost.id, bool: true, userType: 'sentToId', modelType: 'SharedPost'});
      const fullPost = await axios.get(`/post/updatedPost/${sharePost.Post.id}/${currUser.id}`);
      console.log('seen message', seenMessage);
      //sharePost = seenMessage.data;
      const newSharedPosts = sharedPosts.map((post, ind) => {
        if (ind === sharePostIndex) {
          return seenMessage.data;
        } else {
          return post;
        }
      });
      await setSharedPosts(newSharedPosts);
      await setDisplayPost(fullPost.data);
      await setDisplayMessage(sharePost);
    } catch (error) {
      console.error('could not get full post in mailbox', error);
    }
   
    //console.log('isToday working?', isToday(sharePost.createdAt));
  };
  console.log('share post', sharePost)
  const isToday = (testDate) => {
    const today = new Date();
    const date = new Date(testDate);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();  
  };
  return (
    <div style={{ width: '75%' }}onClick={() => getFullPost()} >
      {sharePost.hasSeen 
        ? <div id='header'>
          <div  style={{ width: '90%', display: 'flex', flexDirection: 'column', marginTop: '.5rem', marginLeft: '.5rem', marginBottom: '.5rem' }} >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{fontStyle:'italic'}}>{user ? user.username : ''}</div>
              <div style={{ fontSize: '.75rem', marginRight: '.5rem', marginLeft: 'auto' }}>{isToday(sharePost.createdAt) ? dayjs(sharePost.createdAt).format('LT') : dayjs(sharePost.createdAt).format('MMM D')}</div>
            </div>
          <div>{sharePost.Post.title}</div>
           </div>
        </div> 
        : <div id='header' className='unread'  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background:"rgba(166, 197, 255, 0.466)", borderColor:"rgba(54, 89, 169, 0.466)" }}>
           <div style={{ width: '90%', display: 'flex', flexDirection: 'column', marginTop: '.5rem', marginLeft: '.5rem', marginBottom: '.5rem' }} >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ fontWeight: 'bold', color:"#e1e1e1" }}>{user ? user.username : ''}</div>
              <div style={{ fontSize: '.75rem', marginRight: '.5rem', marginLeft: 'auto', color:"#e1e1e1" }}>{isToday(sharePost.createdAt) ? dayjs(sharePost.createdAt).format('LT') : dayjs(sharePost.createdAt).format('MMM D')}</div>
            </div>
          <div style={{ color:"#e1e1e1" }}>{sharePost.Post.title}</div>
           </div>
           <div style={{ width: '10%' }}>
           <svg style={{margin:'-.5rem'}}xmlns="http://www.w3.org/2000/svg" fill="rgb(54, 89, 169)" viewBox="0 0 24 24" width="24" height="24">
              <filter id="shadow">
                <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
              </filter>
              <g filter="url(#shadow)">
                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>  
              </g>
            </svg>
          </div>
          </div>}
          
    </div>
  );
};
// {type === 'inbox' ? <div>{`${user.username} sent you a post:`}</div> : <div>{`You sent ${user.username} a post:`}</div>}
