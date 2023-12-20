import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Post from './Post';
import Container from 'react-bootstrap/Container';
import WaveSurferComponent from './WaveSurfer';
import { collapseTextChangeRangesAcrossMultipleVersions, getPositionOfLineAndCharacter } from 'typescript';
interface PostAttributes {
  id: number;
  userId: number;
  title: string;
  categories: string[];
  soundUrl: string;
  commentCount: number;
  likeCount: number;
  listenCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    profileImgUrl: string;
    googleId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  Likes: {
    id: number;
    userId: number;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
  };
  Comments: {
    id: number;
    userId: number;
    postId: number;
    soundUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }
  isLiked: boolean;
}
const UserProfile = ({ audioContext }) => {
  const [selectedUserPosts, setSelectedUserPosts] = useState<PostAttributes[]>([]);
  const [onProfile, setOnProfile] = useState<boolean>(true);
  const currentUser: any = useLoaderData();
  


  const getSelectedUserInfo = async () => {
    try {
      const selectedUserObj = await axios.get(`/post/selected/${currentUser.id}`);
      setSelectedUserPosts(selectedUserObj.data);
      // setUserPosts(selectedUserObj.data[0].Posts)
      console.log('heyx2', selectedUserObj);
    } catch (error) {
      console.error('could not get selected user info', error);
    }
  };
  const updatePost = async (postId, updateType) => {
    try {
      const updatedPost = await axios.get(`/post/updatedPost/${postId}/${currentUser.id}`);
      console.log('updated post obj', updatedPost);
      const postIndex = selectedUserPosts.findIndex((post) => post.id === updatedPost.data.id);
      updatedPost.data.rank = selectedUserPosts[postIndex].rank;
      // console.log('post index', updatePostIndex)
      const postsWUpdatedPost = selectedUserPosts.splice(postIndex, 1, updatedPost.data);
      console.log(postsWUpdatedPost);
      setSelectedUserPosts(postsWUpdatedPost);
    } catch (error) {
      console.log('could not update post', error);
    }
  };
  // console.log('hey', selectedUserPosts)
  useEffect(() => {
    getSelectedUserInfo();
  }, []);
  const numberOfPostsPerRow = 3;
  const rows: object[] = [];
  for (let i = 0; i < selectedUserPosts.length; i += numberOfPostsPerRow) {
    const row = selectedUserPosts.slice(i, i + numberOfPostsPerRow);
    rows.push(row);
  }
  return (
    <Container>
      <div className="user-main">
        <div className="user-profile-card">
          <div className="user-profile-image">
            <img src={currentUser.profileImgUrl} alt="user profile image" />
          </div>
          <div className="user-profile-info">
            <h2 style={{ color: 'white' }}>{currentUser.username}</h2>
          </div>
        </div>
        <div className="grid-post-container">
          {selectedUserPosts.length > 0 ? (
            <Row>
              {selectedUserPosts.map((post) => (
                // console.log('post in map', post);
                <Col key={post.id}>
                  <div className="grid-post-item">
                    <WaveSurferComponent
                      postObj={post}
                      audioUrl={post.soundUrl}
                      postId={post.id}
                      userId={currentUser.id}
                      updatePost={updatePost}
                      getPosts={getSelectedUserInfo}
                      onProfile={onProfile}
                      setOnProfile={setOnProfile}
                    />
                    <Post
                      key={post.id}
                      postObj={post}
                      audioContext={audioContext}
                      user={currentUser}
                      updatePost={updatePost}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <p> No Posts Yet!</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
