const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()
import { Op } from 'sequelize'

import { User, Follower, Post, Sound, } from '../dbmodels'
// ************* GET ROUTES **************

//GET ALL USER FOLLOWING POSTS
router.get('/followingPosts/:userId', async (req: Request, res: Response) => {
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

})
module.exports = router
