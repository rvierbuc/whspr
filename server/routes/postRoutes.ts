const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()
import sequelize, { Op } from 'sequelize'

import { User, Follower, Post, Like, Comment} from '../dbmodels'
// ************* GET ROUTES **************
router.get('/ranked', async (req:Request, res: Response) => {
try{

  const allPosts:any = await Post.findAll({
    include: [Like, Comment],
  })
  const postDataValues = allPosts.map((post) => post.dataValues)

  const postsWRanks = postDataValues.map((post) => {
    let score = post.likeCount + (post.commentCount * .05) + (post.listenCount * .002)
    let today = new Date().getTime()
    let timeSinceCreation = (today - post.createdAt.getTime()) / 14400000
    let decay = 1 + (.4 * (timeSinceCreation ** 2))
    let rank = score / decay
    post.rank = rank
    return post
  }).sort((a, b) => (a.rank > b.rank ? -1 : 1))
  res.send(postsWRanks)
}catch(error){
  console.log('ranked', error)
}
})

//get all users
router.get('/users', async (req: Request, res: Response) => {
  try{
    const users = await User.findAll({})
    res.status(200).send(users)
  }catch(error){
    console.error('could not get all users', error)
    res.sendStatus(500)
  }
})

//GET ALL USER FOLLOWING POSTS
router.get('/following/:userId', async (req: Request, res: Response) => {
const { userId } = req.params;
try{
  const following = await Follower.findAll({
    where: {
      userId
    }
  })
  const followingArr = following.map((follow: any) => {
    let obj: any = {}
    obj.userId = follow.followingId
    return obj
  })
  const followingPosts:any = await Post.findAll({
    where: {
      [Op.or]: followingArr
    },
    include: [
      {
        model: User,
        as: 'user'
      },
      {
        model: Like
      }
    ], 
    order: [
      ['createdAt', 'DESC']
    ],
  })

  const likedPosts = await Like.findAll({
    where: {userId}
  })
  
  const likedPostIdArr = await likedPosts.map((post:any) => post.postId)
  //console.log(likedPostIdArr)
  const addIsLikedPair =  (postArr) => {
    for(let i = 0; i < postArr.length; i++){
      if(likedPostIdArr.includes(postArr[i].id)){
        //console.log('true')
        postArr[i].dataValues.isLiked = true
      }else {
        postArr[i].dataValues.isLiked = false
      }
    }
  }

    await addIsLikedPair(followingPosts)
    //console.log(followingPosts)
    await res.status(200).send(followingPosts)

}catch(error){
  res.sendStatus(500)
  console.log('could not get following posts', error)
}

})
//gets all posts
router.get('/explore/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try{
    const postsArr = await Post.findAll({
      //need to figure this out so you can exclude viewing user
      // where: {
      //   [Op.ne]: userId 
      // },
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Like
        }
      ], 
      order: [
        ['createdAt', 'DESC']
      ],
    })
    const likedPosts = await Like.findAll({
      where: {userId}
    })
    
    const likedPostIdArr = await likedPosts.map((post:any) => post.postId)
    //console.log(likedPostIdArr)
    const addIsLikedPair =  (postArr) => {
      for(let i = 0; i < postArr.length; i++){
        if(likedPostIdArr.includes(postArr[i].id)){
          //console.log('true')
          postArr[i].dataValues.isLiked = true
        }else {
          postArr[i].dataValues.isLiked = false
        }
      }
    }
  
      await addIsLikedPair(postsArr)
      //console.log(followingPosts)
      await res.status(200).send(postsArr)  
  }catch(error){
    res.sendStatus(500)
    console.log('could not get following posts', error)
  }
  
  })
//creates comment 
  router.post('/createCommentRecord', async (req: Request, res: Response) => {
    const { userId, postId, soundUrl } = req.body
    try{
      await Comment.create({userId, postId, soundUrl})
      res.sendStatus(201)
    }catch(error){
      console.log('could not add comment', error)
      res.sendStatus(500)
    }
  })
//add following relationship
  router.post('/startFollowing', async(req: Request, res: Response) =>{
    const {userId, followingId} = req.body
    console.log(userId, followingId)
    try{
      const startFollowing = await Follower.create({userId, followingId})
      res.sendStatus(201)
    }catch(error){
      console.error('could not follow', error)
      res.sendStatus(500)
    }
   })
//allows user to like a post and add a record to the like table
router.post('/like', async (req: Request, res: Response) => {
  const {userId, postId} = req.body;
    try {
      const createdLike = await Like.create({
        userId,
        postId
      })
      console.log(createdLike)
      res.sendStatus(201)
    } catch(error) {
      console.log('could not add like', error)
      res.sendStatus(500)
    }
 })

 router.put('/updateCount', async (req: Request, res: Response) => {
  const { column, type, id } = req.body

try{
let updateResult;

  const postToUpdate:any = await Post.findByPk(id)
  if(type === "increment"){
    updateResult = await postToUpdate.increment(column)
    console.log(updateResult)
  }

  if(type === "decrement"){
    updateResult = await postToUpdate.decrement(column)
    console.log(updateResult)
  }
  res.status(200).send(updateResult)
}catch(error){
  console.error('could not update count', error)
}
 } )
 //allows user to unlike a post and removes like record from db
 router.delete('/unlike/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const destroyLike = await Like.destroy({
      where: {
        id
      }
    })
    console.log(destroyLike)
    res.sendStatus(201)

  } catch(error){
    console.log('could not remove like', error)
    res.sendStatus(500)
  }
 })
//gets all comments for one post
 router.get('/comment/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
try{
  const postComments = await Comment.findAll({
    where: {
      postId
    },
    include: User,
    order: [
      ['createdAt', 'DESC']
    ],
  })

  res.status(200).send(postComments)

} catch(error){
  console.log('could not get post comments', error)
  res.sendStatus(500)
}
 })
//get only one user's posts
 router.get('/selected/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try{
    const selectedUserPosts = await Post.findAll({ 
      where: {userId: id},
      include: [{
        model: User,
        as: 'user'
      },
    Like,
    Comment]
    }
  )
    console.log('got user posts', selectedUserPosts)
    res.status(200).send(selectedUserPosts)
  } catch(error) {
    console.error('query failed: could not get selected user', error)
    res.sendStatus(500)
  }
 })

 router.post('/startFollowing', async(req: Request, res: Response) =>{
  const {userId, followingId} = req.body
  console.log(userId, followingId)
  try{
    const startFollowing = await Follower.create({userId, followingId})
    res.send(startFollowing)
  }catch(error){
    console.error('could not follow', error)
    res.sendStatus(500)
  }
 })
module.exports = router
