import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Post from './Post';
import RadioConfig from './RadioConfig';
import Container from 'react-bootstrap/Container';
import WaveSurferComponent from './WaveSurfer';
import WaveSurferSimple from './WaveSurferSimple';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

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
  };
  isLiked: boolean;
}
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
const UserProfile = ({ audioContext, setRoomProps }) => {
  const [selectedUserPosts, setSelectedUserPosts] = useState<PostAttributes[]>([]);
  const [onProfile, setOnProfile] = useState<boolean>(true);
  const [onUserProfile, setOnUserProfile] = useState<boolean>(true);
  const [selectedUserFollowers, setSelectedUserFollowers] = useState<FollowerAttributes[]>([]);
  const [currentDeletePostId, setCurrentDeletePostId] = useState<number>(0);
  const [selectedUserFollowing, setSelectedUserFollowing] = useState<FollowingAttributes[]>([]);
  const [displayFollowers, setDisplayFollowers] = useState<boolean>(true);
  const currentUser: any = useLoaderData();

  // setting a delete state => if true => render a fade in asking if the user wants to delete the post
  // then if they delete => set the state with the current posts
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [correctPostId, setCorrectPostId] = useState<number | null>(null);

  const getSelectedUserInfo = async () => {
    try {
      const selectedUserObj = await axios.get(
        `/post/selected/${currentUser.id}`,
      );
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
      const postIndex = await selectedUserPosts.findIndex((post) => post.id === updatedPost.data.id);
      //updatedPost.data.rank = selectedUserPosts[postIndex].rank;
      const postsWUpdatedPost = await selectedUserPosts.toSpliced(postIndex, 1, updatedPost.data);
    } catch (error) {
      console.log('could not update post', error);
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
  // use effect to load user posts on page load and the followers
  useEffect(() => {
    getSelectedUserInfo();
    getSelectedUserFollowers();
    getSelectedUserFollowing();
  }, []);
  // code to separate the posts on the user profile into a grid
  const numberOfPostsPerRow = 3;
  const rows: PostAttributes[][] = [];
  for (let i = 0; i < selectedUserPosts.length; i += numberOfPostsPerRow) {
    const row = selectedUserPosts.slice(i, i + numberOfPostsPerRow);
    rows.push(row);
  }
  // delete function
  const handleDelete: (postId: number) => void = async (postId) => {
    try {
      const deletePost = await axios.delete(`/deletePost/${currentUser.id}/${postId}`);
      console.log(deletePost.status);
      const getPosts = await axios.get(`/post/selected/${currentUser.id}`);
      setSelectedUserPosts(getPosts.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (

    <Container>
      <Modal style={ { backgroundColor: 'rgba(209, 209, 209, 0.6)' } } show={isDeleting} onHide={() => setIsDeleting(!isDeleting)}>
        <Modal.Dialog style={ { backgroundColor: 'rgba(209, 209, 209, 0.6)' } }>
          <Modal.Header closeButton>
            <Modal.Title>Delete Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this post?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsDeleting(!isDeleting)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              setIsDeleting(false);
              handleDelete(currentDeletePostId);
            }}>Delete</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
      <div className="user-main" style={{ display: 'flex' }}>
        <Col xs={12} lg={5}>
          <Row>
            <div
              className="card user-profile-card"
              style={{ justifyContent: 'center' }}
            >
              <div className="user-profile-image">
                <img
                  src={currentUser.profileImgUrl}
                  alt="user profile image"
                  style={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                />
              </div>
              <div className="user-profile-info">
                <h2 style={{ color: 'white' }}>{currentUser.username}</h2>
              </div>
              <RadioConfig setRoomProps={setRoomProps} />

              <div className="display-followers-btn">
                <button 
                type="button" 
                onClick={() => setDisplayFollowers(true)}
                className='btn btn-light btn-lg'
                >
                  Followers
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayFollowers(false)}
                  className='btn btn-light btn-lg'
                >
                  Following
                </button>
              </div>
            </div>
          </Row>
          {displayFollowers ? (
            <Row>
              <Col xs={12} lg={6}>
                <div className="card user-profile-followers-card">
                  <h2 style={{ color: 'white' }}>Followers</h2>
                  <div className="user-profile-followers">
                    {selectedUserFollowers.map((follower, index) => (
                      <div className="user-profile-follower" key={index}>
                        <Row>
                          <Col>
                            <Link to={`/protected/profile/${follower.id}`}>
                              <img
                                src={follower.profileImgUrl}
                                alt="user profile image"
                                style={{
                                  borderRadius: '50%',
                                  width: '50px',
                                  height: '50px',
                                }}
                              />
                            </Link>
                          </Col>
                          <Col style={{ paddingTop: '10px' }}>
                            <div className="follower-username">
                              <h5
                                style={{
                                  color: 'white',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {follower.username}
                              </h5>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col xs={12} lg={6}>
                <div className="card user-profile-followers-card">
                  <h2 style={{ color: 'white' }}>Following</h2>
                  <div className="user-profile-following">
                    {selectedUserFollowing.map((followedUser, index) => (
                      <div className="user-profile-following" key={index}>
                        <Row>
                          <Col>
                            <Link to={`/protected/profile/${followedUser.id}`}>
                              <img
                                src={followedUser.profileImgUrl}
                                alt="user profile image"
                                style={{
                                  borderRadius: '50%',
                                  width: '50px',
                                  height: '50px',
                                }}
                              />
                            </Link>
                          </Col>
                          <Col style={{ paddingTop: '10px' }}>
                            <div className="follower-username">
                              <h5
                                style={{
                                  color: 'white',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {followedUser.username}
                              </h5>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Col>
        <div className="grid-post-container">
          {rows.map((row, index) => (
            <Row key={index}>
              {row.map((post) => (
                <Col key={post.id}>
                  <div className="grid-post-item">
                    <WaveSurferComponent
                      audioContext={audioContext}
                      postObj={post}
                      audioUrl={post.soundUrl}
                      postId={post.id}
                      userId={currentUser.id}
                      updatePost={updatePost}
                      getPosts={getSelectedUserInfo}
                      onProfile={onProfile}
                      onUserProfile={onUserProfile}
                      setOnProfile={setOnProfile}
                      setIsDeleting={setIsDeleting}
                      setCorrectPostId={setCorrectPostId}
                      setSelectedUserPosts={setSelectedUserPosts}
                      setCurrentDeletePostId={setCurrentDeletePostId}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          ))}
        </div>

      </div>
    </Container>

  );
};

export default UserProfile;
