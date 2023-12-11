import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
const ReadOnlyProfile = ({audioContext}) => {
    const [selectedUserInfo, setSelectedUserInfo] = useState<any>()
    const [following, setFollowing] = useState<boolean>(false)
    //const [userPosts, setUserPosts]  = useState<any>()
    const { id } = useParams();

    const getSelectedUserInfo = async () => {
      try{
        const selectedUserObj = await axios.get(`/post/selected/${id}`)
        setSelectedUserInfo(selectedUserObj.data)
        // setUserPosts(selectedUserObj.data[0].Posts)
        // console.log(selectedUserObj.data[0].Posts)
      }catch(error){
        console.error('could not get selected user info', error)
      }
    }

    const startFollowing = async () => {
      try{
        const createFollowing = await axios.post('/post/startFollowing', {userId: 1, followingId:id})
        if(createFollowing.data === 'Created'){
          setFollowing(true)
        }
      }catch(error){
        console.error('could not follow user', error)

      }
    }
    useEffect(() => {
      getSelectedUserInfo()
    }, [])
    return (
        <div className="user-main">
           {selectedUserInfo ? 
          <div>
            <div className="user-profile-card">
                <div className="user-profile-image">
                    <img src={selectedUserInfo[0].user.profileImgUrl} alt="user profile image" />
                </div>
                <div className="user-profile-info">
                  <h2 style={{color: 'white'}}>{selectedUserInfo[0].user.username}</h2>
                </div>
                {following ? 
                <button
                className='btn btn-light'
                // onClick={() => startFollowing()}
                >Unfollow</button>
                : <button
                className='btn btn-light'
                onClick={() => startFollowing()}
                >Follow</button>}
            </div>
            <div>
              {selectedUserInfo.map((post) => (
                <div>
                <WaveSurferComponent postObj={post} audioUrl={post.soundUrl} postId={post.id} />
                <Post
                  key = {post.id}
                  postObj = {post}
                  audioContext={audioContext}
                />
                {/* each post should have its own instance of a waveSurfer comp */}
      
              </div>
              )) }
            </div>
            </div>
            : <div>Loading...</div>}
        </div>
    )
};

export default ReadOnlyProfile;