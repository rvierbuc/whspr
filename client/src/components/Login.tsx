import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
// import HomePost from './HomePost';
// import Carousel from 'react-bootstrap/Carousel';
// import { Card } from 'react-bootstrap';
import { VerticalCarousel } from './VerticalCarousel';
import HomePageData from '../HomePageData'
const handleAuth = () => {
  window.location.href = '/auth/google';
};

const Login = (props) => {
  const { audioContext } = props;
  const [posts, setPosts] = useState<any>();

  const getHomeFeed = async () => {
    try {
      const homePosts = await axios.get('/post/home');
      console.log(homePosts.data);
      setPosts(homePosts.data);
    } catch (error) {
      console.log('home feed posts', error);
    }
  };

  useEffect(() => {
    getHomeFeed();
  }, []);
  return (
        <div >
         
          <div>
            <div id='home-header' >
            <img 
            src={require('../style/whspr-home.png')}
            width={'auto'}
            height={'200px'}
            alt="whspr logo"
            onClick={() => handleAuth()}
            style={{objectFit: 'scale-down'}}
            />
            {/* <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'auto', justifyContent: 'center' }}> */}
           <button type='button' 
            style={{ fontSize: '2rem', border:'none', borderRadius: '16px', width:'7rem', height:'5rem', position:'absolute', marginRight:'1.5rem', marginBottom:'1rem' }}
            className="login btn btn-dark centered"
            id="header"
            onClick={()=> { handleAuth(); }}>
                Login
            </button>
           {/* </div> */}
          
            </div>
            <VerticalCarousel
            posts={HomePageData.slides}
            leadingText={HomePageData.leadingText}
            audioContext={audioContext}
            ></VerticalCarousel>
          
            
            </div>
          
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
              </Card> 
              
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
              
              */
