import React, { useEffect, useState } from "react";
import axios, {AxiosResponse} from "axios";

import Post from "./Post";
const Feed = () => {
  // interface Post {
  //   category: string;
  //   createdAt
  // }
  // interface Sound {

  // }
//const [posts, setPosts] = useState<AxiosResponse>()
const [posts, setPosts] = useState<any>()

const getFriendsPosts = async() => {
  try{
    const friendsPosts: any = await axios.get('/user/followingPosts/1')
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
        />
      )) : <div>No Posts Yet</div>}
    </div>
  )
}
export default Feed;