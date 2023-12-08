import React, { useEffect, useState } from "react";
import axios, {AxiosResponse} from "axios";

import Post from "./Post";
const Feed = ({ audioContext }: { audioContext: BaseAudioContext }) => {
const [posts, setPosts] = useState<any>()
const userId = 1;

const getFriendsPosts = async() => {
  try{
    const friendsPosts: AxiosResponse = await axios.get('/post/following/1')
    setPosts(friendsPosts.data)
    console.log(friendsPosts.data)
  } catch(error) {
    console.log('client get friends', error)
  }
}


useEffect(() => {
  getFriendsPosts()
}, [])
  return (
    <div>
      <h2>Audio Feed</h2>
      {posts ? posts.map((post: any) => (
        <Post 
          key = {post.id}
          postObj = {post}
          getFriendsPosts={getFriendsPosts}
          audioContext={audioContext}
        />
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