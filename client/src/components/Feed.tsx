import React, { useEffect, useState } from "react";
import axios, {AxiosResponse} from "axios";
import PostCard from "./PostCard"
import Post from "./Post";
import WaveSurferComponent from "./WaveSurfer";
import { useLoaderData } from 'react-router-dom';

const Feed = ({ audioContext }: { audioContext: BaseAudioContext }) => {
const [posts, setPosts] = useState<any>()
const [feed, setFeed] = useState<string>('explore')

const user: any = useLoaderData();
console.log(user)

const getPosts = async(type) => {
  setFeed(type)
  try{
    const allPosts: AxiosResponse = await axios.get(`/post/${type}/${user.id}`)
    setPosts(allPosts.data)
    console.log('all posts', allPosts.data)
  } catch(error) {
    console.log('client get friends', error)
  }
}
useEffect(() => {
  getPosts('explore')
}, [])
  return (
    <div>
    <div className="centered">
<PostCard audioContext={audioContext}/>
    </div>
    {feed === 'following' ?
    <div>
        <button
        type="button"
        className="btn btn-dark"
        onClick={() => getPosts('following')}
        >Following</button>
        <button
        type="button"
        className="btn btn-light"
        onClick={() => getPosts('explore')}
        >Explore</button>
    </div>
    : <div>
      <button
        type="button"
        className="btn btn-light"
        onClick={() => getPosts('following')}
        >Following</button>
        <button
        type="button"
        className="btn btn-dark"
        onClick={() => getPosts('explore')}
        >Explore</button>
      </div>}
      {posts ? posts.map((post: any) => (
        <div>
          <WaveSurferComponent 
          postObj={post} 
          audioUrl={post.soundUrl} 
          postId={post.id} 
          userId={user.id}/>
          <Post
            key = {post.id}
            postObj = {post}
            getPosts={getPosts}
            audioContext={audioContext}
            feed={feed}
            user={user}
          />
          {/* each post should have its own instance of a waveSurfer comp */}

        </div>
      )) : <div>Loading...</div>}
    </div>

  )
}
export default Feed;

/**
 * const test = { data: [
   {
      "id": 8,
      "userId": 2,
      "title": "The Titular2",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:43:27.289Z",
      "updatedAt": "2023-12-07T14:43:27.289Z",
      "user": {
          "id": 2,
          "username": "Rando",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": [
          {
              "id": 3,
              "userId": 1,
              "postId": 8,
              "createdAt": "2023-12-07T20:22:24.877Z",
              "updatedAt": "2023-12-07T20:22:24.877Z"
          },
          {
              "id": 5,
              "userId": 2,
              "postId": 8,
              "createdAt": "2023-12-07T21:46:16.579Z",
              "updatedAt": "2023-12-07T21:46:16.579Z"
          }
      ]
  },
  {
      "id": 10,
      "userId": 2,
      "title": "The Titular2",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:43:27.318Z",
      "updatedAt": "2023-12-07T14:43:27.318Z",
      "user": {
          "id": 2,
          "username": "Rando",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": [
          {
              "id": 4,
              "userId": 1,
              "postId": 10,
              "createdAt": "2023-12-07T21:32:52.225Z",
              "updatedAt": "2023-12-07T21:32:52.225Z"
          }
      ]
  },
  {
      "id": 2,
      "userId": 2,
      "title": "The Titular2",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:38:40.022Z",
      "updatedAt": "2023-12-07T14:38:40.022Z",
      "user": {
          "id": 2,
          "username": "Rando",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": [
          {
              "id": 6,
              "userId": 1,
              "postId": 2,
              "createdAt": "2023-12-07T21:55:25.800Z",
              "updatedAt": "2023-12-07T21:55:25.800Z"
          }
      ]
  },
  {
      "id": 5,
      "userId": 3,
      "title": "The Titular",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:39:38.649Z",
      "updatedAt": "2023-12-07T14:39:38.649Z",
      "user": {
          "id": 3,
          "username": "dom",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 6,
      "userId": 2,
      "title": "The Titular2",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:39:38.649Z",
      "updatedAt": "2023-12-07T14:39:38.649Z",
      "user": {
          "id": 2,
          "username": "Rando",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 4,
      "userId": 2,
      "title": "The Titular2",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:39:38.605Z",
      "updatedAt": "2023-12-07T14:39:38.605Z",
      "user": {
          "id": 2,
          "username": "Rando",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 1,
      "userId": 3,
      "title": "The Titular",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:38:40.022Z",
      "updatedAt": "2023-12-07T14:38:40.022Z",
      "user": {
          "id": 3,
          "username": "dom",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 3,
      "userId": 3,
      "title": "The Titular",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:39:38.605Z",
      "updatedAt": "2023-12-07T14:39:38.605Z",
      "user": {
          "id": 3,
          "username": "dom",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 9,
      "userId": 3,
      "title": "The Titular",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:43:27.318Z",
      "updatedAt": "2023-12-07T14:43:27.318Z",
      "user": {
          "id": 3,
          "username": "dom",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  },
  {
      "id": 7,
      "userId": 3,
      "title": "The Titular",
      "category": "The Categorical",
      "soundUrl": "https://storage.googleapis.com/whspr-sounds/audio/testsound.mp3",
      "createdAt": "2023-12-07T14:43:27.289Z",
      "updatedAt": "2023-12-07T14:43:27.289Z",
      "user": {
          "id": 3,
          "username": "dom",
          "profileImgUrl": "https://website.com/profile-image.jpg",
          "createdAt": "2023-12-07T14:38:40.019Z",
          "updatedAt": "2023-12-07T14:38:40.019Z"
      },
      "Likes": []
  }
]}
 */