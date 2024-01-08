import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import PostCard from './PostCard';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
import { Params, useLoaderData } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useParams } from 'react-router';

const Feed = ({ audioContext }: { audioContext: AudioContext }) => {
  const [posts, setPosts] = useState<any>();
  //const [title, setTitle] = useState<string>('Explore WHSPR');
  const [onProfile, setOnProfile] = useState<boolean>(false);
  const [feed, setFeed] = useState<string>('following');
  const [show, setShow] = useState<boolean>(false)
  //const [isExplore, setIsExplore] = useState<boolean>(true);
  //const [isFollowFeed, setIsFollowFeed] = useState<boolean>(false);
  const user: any = useLoaderData();
  const { type }:Readonly<Params<string>> = useParams();
   console.log(type)
  const getPosts = async (feedType, tag) => {
    setFeed(feedType);
    // if (feedType === 'explore') {
    //   setIsExplore(true);
    //   setIsFollowFeed(false);
    // } else if (feedType === 'following') {
    //   setIsFollowFeed(true);
    //   setIsExplore(false);
    // }
    try {
      // console.log('request variables', type, user.id, tag)
      const allPosts: AxiosResponse = await axios.get(`/post/${type}/${user.id}/${tag}`);
      setPosts(allPosts.data);
      // if(feedType === 'following' && allPosts.data.length === 0){
      //   setFeed('explore')
      //   setShow(true)
      // }
      // if (tag !== 'none') {
      //   setTitle(`Explore #${tag}`);
      // } else if (type === 'following') {
      //   setTitle('Explore Posts from your Friends');
      // } else {
      //   setTitle('Explore WHSPR');
      // }
      console.log('all posts', allPosts.data);
    } catch (error) {
      console.log('client get friends', error);
    }
  };

  const updatePost = async (postId, updateType) => {
    try {
      const updatedPost:any = await axios.get(`/post/updatedPost/${postId}/${updateType}`);
      console.log('updated post obj', updatedPost);
      const postIndex = posts.findIndex((post) => post.id === updatedPost.data.id);
      updatedPost.data.rank = posts[postIndex].rank;
      //console.log('post index', updatePostIndex)
      const postsWUpdatedPost = posts.toSpliced(postIndex, 1, updatedPost.data );
      console.log(postsWUpdatedPost);
      setPosts(postsWUpdatedPost);
    } catch (error) {
      console.log('could not update post', error);
    }
  };
  useEffect(() => {
    //setFeed(type)
    
      console.log('feed', type)
      getPosts(type, 'none');
  
   
  }, [type]);

// SYDNEY => these are placeholders passing into PostCard so my added functionality in RecordPost doesn't conflict
// placeholder is a default for synthAudioChunks as either voice or synth is saved
// default settings are the base settings for the filters
  // const defaultSettings = {
  //   lowPassFrequency: 350,
  //   highPassFrequency: 350,
  //   highPassType: 'highpass',
  //   lowPassType: 'lowpass',
  // }
  // const placeHolder: Blob[] = [];
  return (
    <div>
      {posts 
      ? (posts.length === 0 ? <a href='explore' style={{color:'white', fontSize: 'xxx-large'}}>Explore Popular Posts to Find Friends</a>
        : posts.map((post: any) => (
        <div style={{ marginBottom: '2rem', maxWidth: '950px', marginLeft: 'auto', marginRight: 'auto' }} className="centered">
          <WaveSurferComponent
                  key={post.id}
                  postObj={post}
                  audioUrl={post.soundUrl}
                  postId={post.id}
                  userId={user.id}
                  getPosts={getPosts}
                  updatePost={updatePost}
                  audioContext={audioContext}
                  feed={feed} onProfile={false} setOnProfile={undefined} />
        </div>)
      )) : <div>Loading...</div>}
    </div>

  );
};
export default Feed;

