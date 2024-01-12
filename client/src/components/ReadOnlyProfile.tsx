import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
interface FollowerAttributes {
  id: number;
  username: string;
  profileImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
interface FollowingAttributes {
  id: number;
  username: string;
  profileImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
const ReadOnlyProfile = ({ audioContext }) => {
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>();
  const [following, setFollowing] = useState<boolean>(false);
  const [onGridView, setOnGridView] = useState<boolean>(true);
  const [onUserProfile, setOnUserProfile] = useState<boolean>(false);
  const [onProfile, setOnProfile] = useState<boolean>(true);
  const [selectedUserFollowing, setSelectedUserFollowing] = useState<FollowingAttributes[]>([]);
  const [selectedUserFollowers, setSelectedUserFollowers] = useState<FollowerAttributes[]>([]);
  //const [userPosts, setUserPosts]  = useState<any>()
  const { id } = useParams();
  const user:any = useLoaderData();
  const getSelectedUserInfo = async () => {
    try {
      const selectedUserObj = await axios.get(`/post/selected/${id}`);
      setSelectedUserInfo(selectedUserObj.data);
      // setUserPosts(selectedUserObj.data[0].Posts)
      // console.log(selectedUserObj.data[0].Posts)
    } catch (error) {
      console.error('could not get selected user info', error);
    }
  };
  const updatePost = async (postId, updateType) => {
    try {
      const updatedPost:any = await axios.get(`/post/updatedPost/${postId}/${user.id}`);
      console.log('updated post obj', updatedPost);
      const postIndex = selectedUserInfo.findIndex((post) => post.id === updatedPost.data.id);
      updatedPost.data.rank = selectedUserInfo[postIndex].rank;
      //console.log('post index', updatePostIndex)
      const postsWUpdatedPost = selectedUserInfo.toSpliced(postIndex, 1, updatedPost.data );
      console.log(postsWUpdatedPost);
      setSelectedUserInfo(postsWUpdatedPost);
    } catch (error) {
      console.log('could not update post', error);
    }
  };
  const startFollowing = async () => {
    try {
      const createFollowing = await axios.post('/post/startFollowing', { userId: user.id, followingId: id });
      if (createFollowing.data === 'Created') {
        setFollowing(true);
      }
    } catch (error) {
      console.error('could not follow user', error);

    }
  };

  const stopFollowing = async () => {
    try {
      const createFollowing = await axios.delete(`/post/stopFollowing/${user.id}/${id}`);
      if (createFollowing.data === 'Created') {
        setFollowing(false);
      }
    } catch (error) {
      console.error('could not follow user', error);

    }
  };

  const isFollowing = async () => {
    try {
      const findFollowing = await axios.get(`/post/isFollowing/${user.id}/${id}`);
      if (findFollowing.status === 200) {
        setFollowing(true);
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setFollowing(false);
      }
      console.log('following error', error);
    }
  };
  const getSelectedUserFollowers = async () => {
    try {
      const followers = await axios.get(
        `/post/user/${currentUser.id}/followers`,
      );
      setSelectedUserFollowers(followers.data);
    } catch (error) {
      console.log('error fetching current user followers', error);
    }
  };
  const getSelectedUserFollowing = async () => {
    try {
      const following = await axios.get(
        `/post/user/${currentUser.id}/following`,
      );
      setSelectedUserFollowing(following.data);
      console.log('set following', following.data);
    } catch (error) {
      console.log('error fetching current user following', error);
    }
  };
  useEffect(() => {
    console.log('use effect in read only profile', onUserProfile);
    getSelectedUserInfo();
    isFollowing();
    getSelectedUserFollowers();
    getSelectedUserFollowing();
  }, []);
  return (
        <div >
           {selectedUserInfo ? 
          <div className='card' style={{margin:'1rem', height:'100%'}}>
            <div id='header' style={{margin:'1rem'}}>
            <div className="row-container" >
                <div >
                    <img className="profile-image"
                    style={{ height: '100px' }}
                    src={selectedUserInfo[0].user.profileImgUrl} alt="user profile image" />
                </div>
                <div className="user-profile-info">
                  <h2 style={{ color: '#0f0c0c', fontSize: '2rem' }}>{selectedUserInfo[0].user.username}</h2>
                </div>
                {following ? 
                <button
                className='btn btn-light'
                style={{ marginLeft: 'auto', marginRight: '1rem' }}
                onClick={() => stopFollowing()}
                >Unfollow</button>
                  : <button
                className='btn btn-light'
                style={{ marginLeft: 'auto', marginRight: '1rem' }}
                onClick={() => startFollowing()}
                >Follow</button>}
            </div>
            <div className='row-container' style={{justifyContent:'center'}}>
              <div style ={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', margin:'.5rem'}}>
                  <div>{selectedUserFollowing.length}</div>
                  <div>Following</div>
              </div>
              <div style ={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', margin:'.5rem'}}>
                  <div>{selectedUserFollowers.length}</div>
                  <div>Following</div>
              </div>
            </div>
            </div>
            <div style={{maxWidth: '100vw', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'start', gap:'1rem', marginLeft:'.5rem'}}>
              {selectedUserInfo.map((post, index) => (
                <div>
                <WaveSurferComponent
                key={index}
                postObj={post}
                audioUrl={post.soundUrl}
                postId={post.id}
                userId={user.id}
                getPosts={getSelectedUserInfo}
                onGridView={onGridView}
                updatePost={updatePost}
                setOnGridView={setOnGridView}
                onProfile={onProfile}
                postWidth={100 / selectedUserInfo.length}
                />
                {/* each post should have its own instance of a waveSurfer comp */}
              </div>
              )) }
            </div>
            </div>
             : <div>Loading...</div>}
        </div>
  );
};

export default ReadOnlyProfile;