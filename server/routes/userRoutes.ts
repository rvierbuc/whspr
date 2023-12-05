const express = require('express')
import { Request, Response } from 'express'
const router = express.Router()
const User = require('../../models/user')
const FollowerModel = require('../../models/follower')
const Post = require('../../models/post')


//Model needs to be created from the database instance
const FollowerModel = Follower(db, DataTypes);
//user example
const UserModel = User(db, DataTypes);
// ************* GET ROUTES **************

//GET ALL USER POSTS

//GET ALL USER FOLLOWING POSTS
router.get('/followingPosts', (req: Request, res: Response) => {
//console.log(Follower());
  FollowerModel.findAll({
    where:{
      userId: 1
    },
    include: User
  })
  .then((results: any) => console.log('following results', results))
  .catch((error: Error) => console.log('following results', error))


module.exports = router