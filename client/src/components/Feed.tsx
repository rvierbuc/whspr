import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import PostCard from './PostCard';
import Post from './Post';
import WaveSurferComponent from './WaveSurfer';
import { Params, useLoaderData } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { get } from 'http';
import { Toaster } from 'react-hot-toast';

const Feed = ({ audioContext }: { audioContext: AudioContext }) => {
  const [posts, setPosts] = useState<any>();
  //const [title, setTitle] = useState<string>('Explore WHSPR');
  //const [onProfile, setOnProfile] = useState<boolean>(false);
  const [feed, setFeed] = useState<string>('following');
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cannotSelect, setCannotSelect] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [tagCounter, setTagCounter] = useState<number>(0);
  //const tagsRef = useRef([]);
  const user: any = useLoaderData();
  const { type }: Readonly<Params<string>> = useParams();
  //const selected = [];
  // navigate functionality
  const navigate = useNavigate();
  const handleNavigation: (path: string) => void = (path: string) => navigate(path);

  const getTagList = async () => {
    const tagList: AxiosResponse = await axios.get('/post/tags');
    setTags(tagList.data);
  };
  const getPosts = async (feedType, tag) => {
    setFeed(feedType);
    try {
      const allPosts: AxiosResponse = await axios.get(`/post/${type}/${user.id}/${tag}`);
      if (allPosts.data.length === 0) {
        handleNavigation('/protected/feed/explore');
        if (!user.selectedTags) {
          setShowTagModal(true);
          getTagList();
        }

      } else {
        setPosts(allPosts.data);
      }
  
    } catch (error) {
      console.error('client get friends', error);
    }
  };

  const handleTagSelect = (event): void => {

    if (selectedTags.includes(event.target.value)) {
      setSelectedTags(selectedTags.filter(tag => tag !== event.target.value));
      setTagCounter(() => tagCounter - 1);
      event.target.className = 'not-selected-tag';
    }

    if (!selectedTags.includes(event.target.value)) {
      setSelectedTags([...selectedTags, event.target.value]);
      setTagCounter(() => tagCounter + 1);
      event.target.className = 'selected-tag';
      if (tagCounter === 5) {
        setCannotSelect(true);
        event.target.className = 'not-selected-tag';
        setSelectedTags(selectedTags.filter(tag => tag !== event.target.value));
      }
    }
  };

  const submitTagSelection = () => {
    axios.put(`/post/selectedTags/${user.id}`, { tags: selectedTags });
    setShowTagModal(false);
    getPosts('explore', 'none');
  };
  const updatePost = async (postId, userId) => {
    try {
      const updatedPost: any = await axios.get(`/post/updatedPost/${postId}/${userId}`);
      const postIndex = posts.findIndex((post) => post.id === updatedPost.data.id);
      updatedPost.data.rank = posts[postIndex].rank;
      const postsWUpdatedPost = posts.toSpliced(postIndex, 1, updatedPost.data);
      setPosts(postsWUpdatedPost);
    } catch (error) {
      console.error('could not update post', error);
    }
  };
  useEffect(() => {
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
      <Modal id='modal-background' show={showTagModal} onHide={() => setShowTagModal(false)} aria-labelledby="contained-modal-title-vcenter"
        centered>
        {/* <Modal.Dialog > */}
        <Modal.Header id='tag-mod-header' centered>
          What do you want to hear about?
        </Modal.Header >
        <Modal.Body id='tags' style={{ fontSize: '1.5rem' }} >
          Select up to 5 tags to get started with some interesting whsprs.
          <div className='card' style={{ margin: '.5rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tags ? tags.map((tag, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'row', margin: '.5rem' }}>
                <button className='not-selected-tag' onClick={(e) => handleTagSelect(e)} disabled={cannotSelect} value={tag}>{`#${tag}`}</button>
              </div>
            )) : <div></div>}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>

            <button id='tag-submit' onClick={() => submitTagSelection()}>Submit</button>
          </div>
          {/* <button onClick={ () => setCannotSelect(false)}>edit</button> */}
        </Modal.Body>
        {/* </Modal.Dialog> */}
      </Modal>
      {posts
        ? (posts.length === 0 ? <a href='explore' style={{ color: 'white', fontSize: 'xxx-large' }}>Explore Popular Posts to Find Friends</a>
          : posts.map((post: any) => (
        <div style={{ marginBottom: '2rem', maxWidth: '950px', marginLeft: 'auto', marginRight: 'auto' }} className="centered">
              <Toaster />
          <WaveSurferComponent
                  key={post.id}
                  postObj={post}
                  audioUrl={post.soundUrl}
                  postId={post.id}
                  userId={user.id}
                  getPosts={getPosts}
                  updatePost={updatePost}
                  audioContext={audioContext}
                  waveHeight={500}
                  feed={feed} onProfile={false} setOnProfile={undefined} containerType='feed'/>
        </div>),
          )) : <div>Loading...</div>}
    </div>

  );
};
export default Feed;

