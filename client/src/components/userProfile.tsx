import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
const UserProfile = ({audioContext}) => {
    const [selectedUser, setSelectedUser] = useState<any>({});
    const currentUser: any = useLoaderData();
    console.log('userLoader', currentUser);

    const getSelectedUserInfo = async () => {
        try{
          const selectedUserObj = await axios.get(`/post/selected/${currentUser.id}`)
          setSelectedUser(selectedUserObj.data)
          // setUserPosts(selectedUserObj.data[0].Posts)
           console.log('hey', selectedUserObj)
        }catch(error){
          console.error('could not get selected user info', error)
        }
      }
     // console.log('hey', selectedUser)
      useEffect(() => {
        getSelectedUserInfo()
      }, [])
    return (
        <div className="user-main">
            <Card style={{ width: '20rem' }}>
                <div className="user-main-card">
                    <div className="user-pfp">
                        <img src={currentUser.profileImgUrl} alt="user profile image" />
                    </div>
                </div>
                <Card.Body>
                    <Card.Title>{currentUser.username}</Card.Title>
                    <Card.Text>
                        {currentUser.bio || 'No bio yet'}
                    </Card.Text>
                </Card.Body>
            </Card>
            {/* <div className="user-profile-card">
                <div className="user-profile-image">
                    <img src={currentUser.profileImgUrl} alt="user profile image" />
                </div>
                <div className="user-profile-info">
                    <h1 style={{color: 'white'}}>{currentUser.username}</h1>
                </div>
            </div> */}
            {selectedUser.length > 0 ? selectedUser.map((post) => (
            <div>
            <WaveSurferComponent postObj={post} audioUrl={post.soundUrl} postId={post.id} />
            <Post
            key = {post.id}
            postObj = {post}
            audioContext={audioContext}
            />
            {/* each post should have its own instance of a waveSurfer comp */}
            </div>
        )) : <div style={{color: 'white'}}>No Posts Yet!</div>}
        </div>
    )
};

export default UserProfile;
