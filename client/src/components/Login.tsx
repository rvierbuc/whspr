import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import HomePost from './HomePost';
import Carousel from 'react-bootstrap/Carousel';
import { Card } from 'react-bootstrap';
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
          {posts ? 
          <div>
            <div id='home-header' className="d-flex align-items-center justify-content-start">
            <img 
            src={require('../style/whspr-logo.png')}
            width={'auto'}
            height={'250px'}
            alt="whspr logo"
            onClick={() => handleAuth()}
            style={{ cursor: 'pointer', marginTop:'15px', marginRight: '15px' }}
            />
              <div style={{display:'flex', flexDirection:'column', marginLeft:'auto', }}>
          
           <h1 style={{color:'rgb(166, 197, 255)', marginRight:'25px'}}>Open Your Ears</h1>
           <button type='button' 
            style={{ marginLeft: 'auto', padding:'25px', fontSize:'xx-large', borderRadius:'15px', marginRight:'70px' }}
            className="login btn btn-dark centered"
            id="header"
            onClick={()=> { handleAuth(); }}>
                Login
            </button>
           </div>
          
            </div>
            
            <div className="d-flex align-items-center justify-content-center">
           <Carousel slide={true} pause='hover' prevIcon={null} nextIcon={null} style={{margin: 'auto', width:'auto' }} className="centered">
            
        {  posts.map((post) => {
          return (
            <Carousel.Item interval={5500} style={{ width:'auto'}} className='centered'>
            <HomePost
            key={post.id}
            postId={post.id}
            audioContext={audioContext}
            postObj={post}
            audioUrl={post.soundUrl}
            />
            </Carousel.Item>)
            
          })}
          </Carousel>
         </div>
            
            </div>
            : <div>Loading...</div>
      }
        </div>
        );
      };
      
      export default Login;
/** <Card style={{height:'245px', width: '235px'}}>
            <Card.Header>Log in to Hear What's Going On</Card.Header>
            <button type='button' 
            style={{ margin: 'auto'}}
            className="btn btn-dark centered"
            onClick={()=> { handleAuth(); }}>
                Login
            </button>
              </Card> */