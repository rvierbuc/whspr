const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()
import { Op } from 'sequelize'

import { User, Follower, Post, Sound, } from '../dbmodels'
// ************* GET ROUTES **************

//GET ALL USER POSTS

//GET ALL USER FOLLOWING POSTS
router.get('/followingPosts/:userId', async (req: Request, res: Response) => {
//console.log(Follower());
// Post.create({userId: 3, soundId: 3, category: 'music', title: 'groovy tunes'})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))
// Sound.create({userId: 3, recordingUrl: 'some/path3'})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))
// User.create({username: 'george', profileImgUrl: 'some/path'})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))
// Follower.create({userId: 1, followingId: 3})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))
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
    }
    ]
  })
  res.status(200).send(followingPosts)

}catch(error){
  res.sendStatus(500)
  console.log('server', error)
}
// Follower.findAll({
//   where: {
//     userId: 1
//   },
//   include: User
// })
// .then((response: any) => console.log('success', response))
// .catch((err: Error) => console.log('err', err))
})
module.exports = router
//create({userId: 2, category: 'comedy', title: 'funny stuff', cloudPath: 'some/path'})