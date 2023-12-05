const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()

import { User, Follower } from '../dbmodels'
// ************* GET ROUTES **************

//GET ALL USER POSTS

//GET ALL USER FOLLOWING POSTS
router.get('/followingPosts', (req: Request, res: Response) => {
//console.log(Follower());
// Follower.create({userId: 1, followingId: 2})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))

// User.create({username: 'angel', progileImgUrl: 'some/path'})
// .then(() => console.log('success'))
// .catch((err: Error) => console.log('err', err))
Follower.findAll({
  where: {
    userId: 1
  },
  include: User
})
.then((response: any) => console.log('success', response))
.catch((err: Error) => console.log('err', err))
})
module.exports = router
//create({userId: 2, category: 'comedy', title: 'funny stuff', cloudPath: 'some/path'})