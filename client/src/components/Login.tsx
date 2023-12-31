import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import HomePost from './HomePost';
const handleAuth = () => {
  window.location.href = '/auth/google';
};

const Login = (props) => {
  const { audioContext } = props
  const [posts, setPosts] = useState<any>()

  const getHomeFeed = async () => {
    try{
      const homePosts = await axios.get('/post/home')
      console.log(homePosts.data)
      setPosts(homePosts.data)
    } catch (error){
      console.log('home feed posts', error)
    }
  }

  useEffect(() => {
    getHomeFeed()
  },[])
  return (
        <div >
            <div className="d-flex justify-content-center align-items-center vh-100">
            <img 
            src={require('../style/whspr-logo.png')}
            width={100}
            height={100}
            alt="whspr logo"
            onClick={() => handleAuth()}
            style={{ cursor: 'pointer' }}
            />
            <button type='button' 
            className="btn btn-dark"
            onClick={()=> { handleAuth(); }}>
                Login
            </button>
            </div>
            {posts 
            ? posts.map((post) => {
              return (
              <HomePost
              key={post.id}
              postId={post.id}
              audioContext={audioContext}
              postObj={post}
              audioUrl={post.soundUrl}
              />)
            })
          : <div></div>}
        </div>
  );
};

export default Login;