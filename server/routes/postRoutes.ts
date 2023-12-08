const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()
import { Op } from 'sequelize'

import { User, Follower, Post, Like, Comment} from '../dbmodels'
// ************* GET ROUTES **************

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
  const followingPosts = await Post.findAll({
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
  res.status(200).send(followingPosts)

}catch(error){
  res.sendStatus(500)
  console.log('could not get following posts', error)
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
module.exports = router
/**
 *  try {
      const destroyLike = await Like.destroy({
        where: {
          [Op.and]: [{userId}, {postId}]
        }
      })
      console.log(destroyLike)
      res.sendStatus(201)

    } catch(error){
      console.log('could not remove like', error)
      res.sendStatus(500)
    }
 */